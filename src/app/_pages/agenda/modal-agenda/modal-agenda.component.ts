// modal-agenda.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

// Imports dos módulos
import { Status } from '../../../_module/statusModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { Profissional } from '../../../_module/profissionalModule';
import { Sala } from '../../../_module/salasModule';
import { Usuario } from '../../../_module/usuarioModule';
import { Plano } from '../../../_module/planoModule';
import { Agenda } from '../../../_module/agendaModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';

// Imports dos serviços
import { StatusServerService } from '../../../_services/status-server.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { AgendaService } from '../../../_services/agenda.service';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { SalasService } from '../../../_services/salas.service';

interface Patient {
  name: string;
  cpf: string;
  phone: string;
}

@Component({
  selector: 'app-modal-agenda',
  templateUrl: './modal-agenda.component.html',
  styleUrls: ['./modal-agenda.component.css']
})
export class ModalAgendaComponent implements OnInit {
  @Input() selectedEvent: any = null;
  @Input() selectedDate: string = '';
  @Output() onSave = new EventEmitter<Agenda>();

  formulario!: FormGroup;
  errorMessage = '';
  camposFinancPagar = false;
  searchTerm: string = '';
  filteredPatients: Patient[] = [];
  newPatient: Patient = { name: '', phone: '', cpf: '' };

  listaStatus: Status[] = [];
  listaCentroDeCusto: CentroDeCusto[] = [];
  listaProfissional: Profissional[] = [];
  listaPlano: Plano[] = [];
  listaSala: Sala[] = [];
  listaUsuario: Usuario[] = [];
  listaFormaPagamento: FormaPagamento[] = [];
  listaTipoPagamento: TipoPagamento[] = [];

  private patients: Patient[] = [
    { name: 'João Silva', cpf: '123.456.789-00', phone: '(11) 99999-9999' },
    { name: 'Maria Oliveira', cpf: '987.654.321-00', phone: '(11) 88888-8888' },
    { name: 'Carlos Souza', cpf: '456.123.789-00', phone: '(11) 77777-7777' }
  ];

  constructor(
    private fb: FormBuilder,
    private statusService: StatusServerService,
    private centroDeCustoService: CentroDeCustoService,
    private profissionalService: ProfissionalService,
    private financReceberService: FinancReceberService,
    private agendaService: AgendaService,
    private tipoPagamentoService: TipoPagamentoService,
    private formaPagamentoService: FormaPagamentoService,
    private salaService: SalasService,
    private toastr: ToastrService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      id: [null],
      titulo: [null, [Validators.required]],
      dataCompomisso: [null, [Validators.required]],
      horaInicio: [null, [Validators.required]],
      DataCompromissoFim: [null, [Validators.required]],
      dataCancelamento: [null],
      pacienteId: [1, [Validators.required]],
      profissionalId: [null, [Validators.required]],
      convenioId: [null],
      avulso: [false],
      statusId: [null, [Validators.required]],
      salaId: [null, [Validators.required]],
      pacoteId: [null, [Validators.required]],
      financReceberId: [null],
      financReceber: this.fb.group({
        id: [null],
        idOrigem: [''],
        nrDocto: [''],
        dataEmissao: ['', [Validators.required]],
        valorOriginal: [''],
        valorPago: [''],
        parcela: [1, [Validators.required, Validators.min(1)]],
        valor: [0, [Validators.required, Validators.min(1)]],
        status: [''],
        notaFiscal: [''],
        descricao: ['', [Validators.required]],
        classificacao: [''],
        observacao: [''],
        pacienteId: [''],
        fornecedorId: [''],
        centroCustoId: [''],
        bancoId: [''],
        subFinancReceber: this.fb.array([])
      }),
      observacao: [null],
      lembrete: [false],
      vinculoComAgenda: [false],
      usuarioCriacaoId: [null],
      dataCriacao: [null],
      usuarioAlteracaoId: [null],
      dataAlteracao: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    
    // Inicializar campos quando for novo evento
    if (!this.selectedEvent && this.selectedDate) {
      const currentDate = new Date(this.selectedDate);
      this.formulario.patchValue({
        dataCompomisso: this.selectedDate,
        horaInicio: '08:00',
        DataCompromissoFim: this.selectedDate
      });
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      await Promise.all([
        this.getCentroDeCusto(),
        this.getProfissional(),
        this.getStatus(),
        this.getSala(),
        this.getFP(),
        this.getTP()
      ]);
    } catch (error) {
      this.toastr.error('Erro ao carregar dados iniciais', 'Erro');
      console.error('Erro ao carregar dados:', error);
    }
  }

  // ... [Manter os métodos de busca de dados como estão] ...

  get subFinancReceber(): FormArray {
    return this.formulario.get('financReceber.subFinancReceber') as FormArray;
  }

  onSearch(): void {
    if (this.searchTerm.length >= 3) {
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPatients = [];
    }
  }

  pagamentoAvulso(): void {
    const pagamentoAvulso = this.formulario.get('avulso')?.value === 'true';
    this.camposFinancPagar = pagamentoAvulso;

    if (pagamentoAvulso) {
      this.getFP();
      this.getTP();
    }
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('financReceber.valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('financReceber.parcela')?.value || 1;
    
    this.subFinancReceber.clear();
    const valorParcela = Number((valorTotal / quantidadeParcelas).toFixed(2));

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      this.subFinancReceber.push(this.criarFormParcela(i + 1, valorParcela, dataVencimento));
    }
  }

  private criarFormParcela(numero: number, valor: number, dataVencimento: Date): FormGroup {
    return this.fb.group({
      id: [null],
      financReceberId: [null],
      parcela: [numero],
      valor: [valor, [Validators.required, Validators.min(0)]],
      dataVencimento: [dataVencimento.toISOString().split('T')[0], [Validators.required]],
      dataPagamento: [''],
      observacao: [''],
      desconto: [0],
      juros: [0],
      multa: [0],
      formaPagamentoId: [''],
      tipoPagamentoId: ['']});
    }
  
    onValorTotalChange(): void {
      if (this.formulario.get('financReceber.parcela')?.value > 0) {
        this.gerarParcelas();
      }
    }
  
    fecharModal(): void {
      const modalElement = document.getElementById('modalAgenda');
      if (modalElement) {
        this.formulario.reset();
        const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
        bootstrapModal?.hide();
      }
    }
  
    async onSubmit(): Promise<void> {
      if (this.formulario.invalid) {
        this.formulario.markAllAsTouched();
        this.toastr.error('Por favor, preencha os campos obrigatórios', 'Erro');
        return;
      }
  
      try {
        const agendaData = this.prepararDadosAgenda();
        const operation = agendaData.id 
          ? this.agendaService.Atualizar(agendaData)
          : this.agendaService.Criar(agendaData);
  
        await operation.toPromise();
        
        const action = agendaData.id ? 'atualizado' : 'criado';
        this.toastr.success(`Agenda ${action} com sucesso!`, 'Sucesso');
        this.onSave.emit(agendaData);
        this.fecharModal();
      } catch (error) {
        this.toastr.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        console.error('Erro ao salvar agenda:', error);
      }
    }
  
    private prepararDadosAgenda(): Agenda {
      const formData = this.formulario.value;
      const financReceber = formData.financReceber;
  
      if (financReceber && formData.avulso === 'true') {
        financReceber.pacienteId = formData.pacienteId;
        financReceber.descricao = `${formData.titulo} - ${formData.observacao}`;
        financReceber.dataEmissao = new Date();
      } else {
        formData.financReceber = null;
      }
  
      return formData as Agenda;
    }
  
    // Métodos de busca de dados
    private async getStatus(): Promise<void> {
      try {
        const response = await this.statusService.Listar(undefined, undefined, undefined, false).toPromise();
        if (response?.dados) {
          this.listaStatus = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar status:', error);
        throw error;
      }
    }
  
    private async getCentroDeCusto(): Promise<void> {
      try {
        const response = await this.centroDeCustoService.Listar().toPromise();
        if (response?.dados) {
          this.listaCentroDeCusto = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar centro de custo:', error);
        throw error;
      }
    }
  
    private async getProfissional(): Promise<void> {
      try {
        const response = await this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).toPromise();
        if (response?.dados) {
          this.listaProfissional = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        throw error;
      }
    }
  
    private async getSala(): Promise<void> {
      try {
        const response = await this.salaService.Listar().toPromise();
        if (response?.dados) {
          this.listaSala = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        throw error;
      }
    }
  
    private async getFP(): Promise<void> {
      try {
        const response = await this.formaPagamentoService.Listar().toPromise();
        if (response?.dados) {
          this.listaFormaPagamento = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar formas de pagamento:', error);
        throw error;
      }
    }
  
    private async getTP(): Promise<void> {
      try {
        const response = await this.tipoPagamentoService.ListarTipoPagamento().toPromise();
        if (response?.dados) {
          this.listaTipoPagamento = response.dados;
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de pagamento:', error);
        throw error;
      }
    }
  }