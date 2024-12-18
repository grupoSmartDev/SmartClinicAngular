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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Agenda } from '../../../_module/agendaModule';
import { AgendaService } from '../../../_services/agenda.service';
import { FinancReceber, StatusPagamento } from '../../../_module/financReceberModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { SalasService } from '../../../_services/salas.service';

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
    private agendaService : AgendaService,
    private tipoPagamentoService : TipoPagamentoService,
    private formaPagamentoService : FormaPagamentoService,
    private salaService : SalasService
    ) { 
      this.formulario = fb.group({
        id : [null],
        titulo : [null,Validators.required],
        dataCompomisso : [null,Validators.required],
        horaInicio : [null,Validators.required],
        DataCompromissoFim : [null,Validators.required],
        dataCancelamento : [null],
        pacienteId : [1, Validators.required],
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
  listaFormaPagamento : FormaPagamento[] = [];
  listaTipoPagamento : TipoPagamento[] = [];


  ngOnInit(): void {
    this.getCentroDeCusto();
    this.getProfissional();
    this.getStatus();
    this.getSala();
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

  getFP() : void{
    this.formaPagamentoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaFormaPagamento = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao getbuscar forma de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os forma de pagamento. Tente novamente mais tarde.';
      }
    })
  }

  getTP() : void{
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaTipoPagamento = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    })
  }

  getSala() : void{
    this.salaService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaSala = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
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
    debugger
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro')
    }

    const dataToSave = this.formulario.value as Agenda;


    const financReceber = this.formulario.get('financReceber')?.value;
    if (financReceber) {
      financReceber.pacienteId = dataToSave.pacienteId;
      financReceber.descricao = dataToSave.titulo + ' - ' + dataToSave.observacao;
      financReceber.dataEmissao = new Date();
      dataToSave.financReceber = financReceber;
    }

    const avulso = this.formulario.get('avulso')?.value;

    if (avulso == 'false') {
      try {
        dataToSave.financReceber = null;
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
      this.getFP();
      this.getTP();
    }
    else{
      this.camposFinancPagar = false;
    }
  }

  get subFinancReceber(): FormArray {
    return this.formulario.get('financReceber.subFinancReceber') as FormArray;
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('financReceber.valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('financReceber.parcela')?.value || 1;

    this.subFinancReceber.clear();

    const valorParcela = parseFloat((valorTotal / quantidadeParcelas).toFixed(2));
    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      this.subFinancReceber.push(
        this.fb.group({
          id: [null],
          financReceberId: [null],
          parcela: [i + 1],
          valor: [valorParcela, [Validators.required, Validators.min(0)]],
          dataVencimento: [dataVencimento.toISOString().split('T')[0], Validators.required],
          dataPagamento: [''],
          observacao: [''],
          desconto: [0],
          juros: [0],
          multa : [0],
          formaPagamentoId : [''],
          tipoPagamentoId : [''],
        })
      );
    }
  }

  onValorTotalChange(): void {
    if (this.formulario.get('financReceber.parcela')?.value > 0) {
      this.gerarParcelas();
    }
  }
  
    
  }

