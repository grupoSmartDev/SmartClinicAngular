import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Status } from '../../../_module/statusModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { StatusServerService } from '../../../_services/status-server.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { Profissional } from '../../../_module/profissionalModule';
import { Sala } from '../../../_module/salasModule';
import { Usuario } from '../../../_module/usuarioModule';
import { Plano } from '../../../_module/planoModule';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Agenda } from '../../../_module/agendaModule';
import { AgendaService } from '../../../_services/agenda.service';
import { FinancReceber, StatusPagamento } from '../../../_module/financReceberModule';

@Component({
  selector: 'app-modal-agenda',
  templateUrl: './modal-agenda.component.html',
  styleUrl: './modal-agenda.component.css'
})
export class ModalAgendaComponent implements OnInit {

  constructor(
    private statusService : StatusServerService,
    private centroDeCustoService : CentroDeCustoService,
    private profissionalService : ProfissionalService,
    private financReceberService : FinancReceberService,
    private fb : FormBuilder,
    private toast : ToastrService,
    private agendaService : AgendaService
    ) { 
      this.formulario = fb.group({
        id : [null],
        titulo : [null,Validators.required],
        dataCompomisso : [null,Validators.required],
        horaInicio : [null,Validators.required],
        DataCompromissoFim : [null,Validators.required],
        dataCancelamento : [null],
        pacienteId : [null, Validators.required],
        profissionalId : [null, Validators.required],    
        convenioId : [null],
        avulso : [null],
        statusId : [null, Validators.required],
        salaId : [null, Validators.required],
        pacoteId : [null, Validators.required],
        financReceberId : [null],
        financReceber : fb.group({
          id: [null],
          idOrigem : [''],
          nrDocto : [''],
          dataEmissao: ['', Validators.required],
          valorOriginal : [''],
          valorPago : [''],
          parcela: [1, [Validators.required, Validators.min(1)]],
          valor: [0, [Validators.required, Validators.min(1)]],
          status : [''],
          notaFiscal : [''],
          descricao: ['', Validators.required],
          classificacao : [''],
          observacao: [''],
          pacienteId: [''],
          fornecedorId : [''],
          centroCustoId: [''],
          bancoId : [''],
          subFinancReceber: this.fb.array([]),
        }),
        observacao : [null],
        lembrete : [false],
        vinculoComAgenda : [false],
        usuarioCriacaoId : [null],
        dataCriacao : [null],
        usuarioAlteracaoId : [null],
        dataAlteracao : [null],
      })
    }

  @Input() selectedEvent: any = null; // Dados do evento selecionado (ou nulo)
  @Input() selectedDate: string = ''; // Data clicada no calendário
  @Output() onSave = new EventEmitter<any>(); // Emite quando um agendamento é salvo
  formulario : FormGroup;

  errorMessage = '';
  camposFinancPagar = false;

  listaStatus : Status[] = [];
  listaCentroDeCusto : CentroDeCusto[] = [];
  listaProfissional : Profissional[] = [];
  listaPlano : Plano[] = [];
  listaSala : Sala[] = [];
  listaUsuario : Usuario[] = [];


  ngOnInit(): void {
    this.getCentroDeCusto();
    this.getProfissional();
    this.getStatus();
  }

  fecharModal() {
    const modal = document.getElementById('modalAgenda');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  saveAgendamento(data: any) {
    this.onSave.emit(data); // Envia os dados para o componente pai
    this.fecharModal();
  }

  getStatus(): void {
    this.statusService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaStatus = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar status:', err);
        this.errorMessage = 'Erro ao carregar os status. Tente novamente mais tarde.';
      }
    });
  }

  getCentroDeCusto() : void {
    this.centroDeCustoService.Listar().subscribe({
      next :(data) => {
        if(data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar centro de custo:', err)
      },
    })
  }

  getProfissional() : void{
    this.profissionalService.Listar().subscribe({
      next : (data) => {
        if(data.dados){
          this.listaProfissional = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }


  searchTerm: string = '';
  patients = [
    { name: 'João Silva', cpf: '123.456.789-00' },
    { name: 'Maria Oliveira', cpf: '987.654.321-00' },
    { name: 'Carlos Souza', cpf: '456.123.789-00' }
  ];
  filteredPatients: any[] = [];
  newPatient = { name: '', phone: '', cpf: '' };

  onSearch() {
    if (this.searchTerm.length >= 3) {
      const term = this.searchTerm.toLowerCase();
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(term)
      );
    } else {
      this.filteredPatients = [];
    }
  }

  //aqui vai vir o novo tipo de modal para cadastro rapido do paciente. 
  openOffcanvas() {
    const offcanvas = document.getElementById('offcanvasPatient');
    if (offcanvas) {
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.show();
    }
  }

  onSubmit() {
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro')
    }

    const dataToSave = this.formulario.value as Agenda;

    if (dataToSave.avulso) {
      try {
        dataToSave.financReceber = this.gerarFinancReceber(dataToSave);
      } catch (error) {
        console.error(error);
        this.toast.error('Erro ao gerar dados financeiros.', 'Erro');
        return;
      }
    }

    const saveOperation = dataToSave.id ? this.agendaService.Atualizar(dataToSave) : this.agendaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Agenda ${action} com sucesso!`, 'Parabéns');
        this.saveAgendamento(dataToSave);
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
    
  }

  pagamentoAvulso(){
    const pagamentoAvulso = this.formulario.get('avulso')?.value == 'true' ? true : false;

    if(pagamentoAvulso){
      this.camposFinancPagar = true;
    }
    else{
      this.camposFinancPagar = false;
    }
  }

  gerarFinancReceber(data: Agenda): FinancReceber {
    const financReceber: FinancReceber = {
      id: '', // Será gerado pelo backend
      idOrigem: '', // ID de origem referenciando o agendamento
      nrDocto: '', // Gera um número de documento único baseado no timestamp
      dataEmissao: new Date(), // Data atual de emissão
      valorOriginal: data.avulso ? this.formulario.get('valor')?.value : 0, // Usa o valor do atendimento se for avulso
      valorPago: 0, // Inicializa como 0 pois ainda não foi pago
      parcela: 1, // Assume 1 parcela padrão
      valor: data.avulso ? this.formulario.get('valor')?.value : 0, // Valor total apenas para atendimentos avulsos
      status: StatusPagamento.PENDENTE, // Define como pendente inicialmente
      notaFiscal: '', // Não há nota fiscal no momento da geração
      descricao: `Atendimento ${data.avulso ? 'avulso' : 'pelo convênio'}: ${data.titulo}`,
      classificacao: 'Atendimento Avulso', // Classificação padrão (ajustar se necessário)
      observacao: data.observacao || '', // Pega a observação se houver
      pacienteId: data.pacienteId!, // ID do paciente vinculado ao agendamento
      paciente: null as any, // Paciente será carregado no backend
      fornecedorId: '', // Não aplicável para este caso
      fornecedor: null as any,
      centroCustoId: this.formulario.get('centroCustoId')?.value || '', // Centro de custo associado ao agendamento
      centroCusto: null as any, // Será tratado no backend
      bancoId: '', // Informar apenas se houver banco vinculado
      banco: null as any,
      subFinancReceber: [], // Sub registros não aplicáveis neste cenário
      usuarioResponsavelId: 'admin', // Assumindo o usuário logado como responsável
      dataUltimaAtualizacao: new Date() // Atualização criada no momento da geração
    };
  
    return financReceber;
  }
    
  }

