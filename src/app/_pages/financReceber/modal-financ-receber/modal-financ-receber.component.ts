import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { FinancReceber } from '../../../_module/financReceberModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { PacienteService } from '../../../_services/paciente.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import * as bootstrap from 'bootstrap';
import { Paciente } from '../../../_module/pacienteModule';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';
import { formatDate } from '@angular/common';
import { InputHelpers } from '../../../_shared/helpers/input-helpers';

@Component({
  selector: 'app-modal-financ-receber',
  templateUrl: './modal-financ-receber.component.html',
  styleUrls: ['./modal-financ-receber.component.css'],
  providers: [DatePtBrPipe]
})

export class ModalFinanceiroReceber implements OnInit {
  @ViewChild('modalComponent') modalComponent?: ElementRef;
  @ViewChild('clienteOffcanvas') offcanvas?: ElementRef;

  private bsOffcanvas: any;
  @Input() data = {} as FinancReceber;
  @Output() dadosAtualizado = new EventEmitter<void>();
  isLoading = false;

  formulario!: FormGroup;
  listaPacientes: Paciente[] = [];
  listaCentroDeCusto!: CentroDeCusto[];
  listaFormaPagamento!: FormaPagamento[];
  listaTipoPagamento!: TipoPagamento[];

  searchTerm: string = '';
  filteredPatients: Paciente[] = [];
  patients!: Paciente[];

  myControl = new FormControl();
  options: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  filteredOptions: string[] = [];
  errorMessage = "";
  InputHelpers = InputHelpers;

  constructor(
    private financReceberService: FinancReceberService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private centroCustoService: CentroDeCustoService,
    private formaPagamentoService: FormaPagamentoService,
    private pacienteService: PacienteService,
    private tipoPagamentoService: TipoPagamentoService,
    private datePipe: DatePtBrPipe
  ) {
    this.formulario = this.fb.group({
      id: [],
      idOrigem: [null],
      nrDocto: [null],
      dataEmissao: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      valorOriginal: [null],
      valorPago: [null],
      parcela: [1, [Validators.required, Validators.min(1)]],
      valor: [0, [Validators.required, Validators.min(1)]],
      status: [''],
      notaFiscal: [null],
      descricao: ['', Validators.required],
      classificacao: [''],
      observacao: [''],
      cpf: [''],
      pacienteId: [null],
      fornecedorId: [null],
      centroCustoId: [null, Validators.required],
      tipoPagamentoId: [null, Validators.required],
      bancoId: [null],
      subFinancReceber: this.fb.array([]),
    });

    this.filteredOptions = this.options;
    this.myControl.valueChanges.subscribe(() => {
      this.filterOptions();
    });
  }
  ngOnInit(): void {
    this.buscarCC();
    this.buscarFP();
    this.buscarTP();
    this.buscarPaciente();
  }

  filterOptions() {
    const value = this.formulario.get('paciente')?.value;
    if (value && value.length >= 3) {
      this.pacienteService.pesquisarPorNome(value).subscribe(
        (response) => {
          this.listaPacientes = response.dados;
          this.filteredOptions = this.listaPacientes.map(p => `${p.nome} - ${p.cpf}`);
        }
      );
    } else {
      this.filteredOptions = [];
    }
  }


  selectOption(option: string) {
    const paciente = this.listaPacientes.find(p => `${p.nome} - ${p.cpf}` === option);
    if (paciente) {
      this.formulario.patchValue({
        paciente: paciente.nome,
        pacienteId: paciente.id,
        cpf: paciente.cpf
      });
    }
    this.filteredOptions = [];
  }

  carregarDados(financReceber: any) {

    // Clear existing subFinancReceber array
    while (this.subFinancReceber.length !== 0) {
      this.subFinancReceber.removeAt(0);
    }
    this.formulario.patchValue(this.data);

    let dataEmissao = this.formulario.get('dataEmissao')?.value;
    if (dataEmissao) {
      dataEmissao = this.datePipe.formatToHtmlDate(dataEmissao);
      this.formulario.patchValue({ dataEmissao });
    }

    // Load subFinancReceber if it exists in the data
    if (this.data.subFinancReceber && this.data.subFinancReceber.length > 0) {
      this.data.subFinancReceber.forEach(subFinanc => {
        let dataVencimento: any = subFinanc.dataVencimento;
        if (dataVencimento) {
          dataVencimento = this.datePipe.formatToHtmlDate(dataVencimento);
        }

        let dataPagamento: any = subFinanc.dataPagamento;
        if (dataPagamento) {
          dataPagamento = this.datePipe.formatToHtmlDate(dataPagamento);
        }

        this.subFinancReceber.push(
          this.fb.group({
            id: [subFinanc.id],
            financReceberId: [subFinanc.financReceberId],
            parcela: [subFinanc.parcela],
            valor: [subFinanc.valor, [Validators.required, Validators.min(0)]],
            dataVencimento: [dataVencimento],
            dataPagamento: [dataPagamento],
            observacao: [subFinanc.observacao],
            desconto: [subFinanc.desconto],
            juros: [subFinanc.juros],
            multa: [subFinanc.multa],
            formaPagamentoId: [subFinanc.formaPagamentoId],
            tipoPagamentoId: [subFinanc.tipoPagamentoId],
          })
        );
      });
    }

    console.log(this.formulario.value);
  }

  fecharModal() {
    let btnCancelar = document.getElementById('btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }

  evitarValorInvalido(event: any): void {
    const valor = +event.target.value;

    if (valor < 1) {
      event.target.value = 1;
      this.formulario.get('parcela')?.setValue(1);
    }
  }


  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as FinancReceber;

    const saveOperation = dataToSave.id
      ? this.financReceberService.Atualizar(dataToSave)
      : this.financReceberService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Contas a receber ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizado.emit();
        this.isLoading = false;
        let inputPacientePesquisado = document.getElementById('paciente') as HTMLInputElement;
        inputPacientePesquisado.value = '';
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  get subFinancReceber(): FormArray {
    return this.formulario.get('subFinancReceber') as FormArray;
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('parcela')?.value || 1;
    
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
          dataPagamento: [null],
          observacao: [''],
          desconto: [0],
          juros: [0],
          multa: [0],
          formaPagamentoId: [null],
          tipoPagamentoId: [null],
        })
      );
    }
  }

  onValorTotalChange(): void {
    if (this.formulario.get('parcela')?.value > 0) {
      this.onTipoPagamentoChange();
      this.gerarParcelas();
    }
  }

  onTipoPagamentoChange(): void {
    const tipoPagamentoId = this.formulario.get('tipoPagamentoId')?.value;

    if (tipoPagamentoId == "1") {
      this.formulario.get('parcela')?.setValue(1);
      this.formulario.get('parcela')?.disable();
    } else {
      this.formulario.get('parcela')?.enable();
    }

    this.gerarParcelas();
  }

  testeEnvios(): void {
    if (this.formulario.valid) {
      console.log('Formulário enviado:', this.formulario.value);
      alert('Formulário enviado com sucesso!');
      // Aqui você pode enviar os dados para o backend
    } else {
      alert('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }

  isDropdownOpen = false;

  onInputFocus(): void {
    this.isDropdownOpen = true;
  }

  onInputBlur(): void {
    // Adicione um pequeno atraso para permitir o clique no dropdown antes de fechá-lo
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }

  buscarCC(): void {
    this.centroCustoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Centro de custo:', err);
        this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      }
    })
  }

  buscarFP(): void {
    this.formaPagamentoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaFormaPagamento = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar forma de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os forma de pagamento. Tente novamente mais tarde.';
      }
    })
  }

  buscarTP(): void {
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

  buscarPaciente(): void {
    this.pacienteService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaPacientes = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar pacientes:', err);
        this.errorMessage = 'Erro ao carregar os pacientes. Tente novamente mais tarde.';
      }
    })
  }

  pesquisarPorCpf() {
    const cpf = this.formulario.get('cpf')?.value;
    if (cpf) {
      this.pacienteService.pesquisarPorCpf(cpf).subscribe(
        (paciente) => {
          if (paciente) {
            this.formulario.patchValue({
              paciente: paciente.nome,
              pacienteId: paciente.id
            });
          } else {
            alert('Paciente não encontrado');
          }
        },
        (error) => {
          console.error('Erro ao pesquisar paciente:', error);
          alert('Erro ao pesquisar paciente');
        }
      );
    }
  }

  ngAfterViewInit() {
    // Inicializa o offcanvas do Bootstrap
    this.bsOffcanvas = new bootstrap.Offcanvas('#clienteOffcanvas');
  }

  abrirOffcanvas() {
    this.bsOffcanvas.show();
  }

  selectPatient(patient: Paciente): void {
    this.formulario.patchValue({
      pacienteId: patient.id,
      'financReceber.pacienteId': patient.id
    });
    this.searchTerm = patient.nome || '';
    this.filteredPatients = [];
  }

  onSearch(): void {
    if (this.searchTerm.length >= 3) {
      this.filteredPatients = this.listaPacientes.filter(patient =>
        patient.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.cpf?.includes(this.searchTerm) ||
        patient.celular?.includes(this.searchTerm)
      );
    } else {
      this.filteredPatients = [];
    }
  }

}
