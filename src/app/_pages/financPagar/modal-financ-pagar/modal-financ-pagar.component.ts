import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FinancPagar } from '../../../_module/financPagarModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { ToastrService } from 'ngx-toastr';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { FinancPagarService } from '../../../_services/financ-pagar.service';
import { DatePtBrPipe } from '../../../_shared/pipes/date-pt-br.pipe';
import { DateHelper } from '../../../_shared/helpers/date-helper';
import { formatDate } from '@angular/common';
import { InputHelpers } from '../../../_shared/helpers/input-helpers';
import { FornecedorService } from '../../../_services/fornecedor.service';
import { Fornecedor } from '../../../_module/fornecedorModule';

@Component({
  selector: 'app-modal-financ-pagar',
  templateUrl: './modal-financ-pagar.component.html',
  styleUrl: './modal-financ-pagar.component.css',
  providers: [DatePtBrPipe],
})
export class ModalFinancPagarComponent {
  @ViewChild('modalComponent') modalComponent?: ElementRef;
  @Input() data = {} as FinancPagar;
  @Output() dadosAtualizado = new EventEmitter<void>();

  isLoading = false;
  formulario!: FormGroup;

  listaFornecedores: Fornecedor[] = [];
  listaCentroDeCusto!: CentroDeCusto[];
  listaFormaPagamento!: FormaPagamento[];
  listaTipoPagamento!: TipoPagamento[];

  searchTerm: string = '';
  filteredFornecedores: Fornecedor[] = [];

  myControl = new FormControl();
  options: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  filteredOptions: string[] = [];
  errorMessage = '';
  InputHelpers = InputHelpers;

  constructor(
    private financPagarService: FinancPagarService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private centroCustoService: CentroDeCustoService,
    private formaPagamentoService: FormaPagamentoService,
    private fornecedorService: FornecedorService,
    private tipoPagamentoService: TipoPagamentoService,
    private datePipe: DatePtBrPipe
  ) {
    this.formulario = this.fb.group({
      id: [],
      idOrigem: [null],
      nrDocto: [null],
      dataEmissao: [
        formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        Validators.required,
      ],
      valorOriginal: [null],
      valorPago: [null],
      parcela: [1, [Validators.required, Validators.min(1)]],
      valor: [0, [Validators.required, Validators.min(1)]],
      status: [null],
      notaFiscal: [null],
      descricao: ['', Validators.required],
      classificacao: [null],
      observacao: [''],
      fornecedorId: [null],
      centroCustoId: [null],
      bancoId: [null],
      tipoPagamentoId: [null],
      subFinancPagar: this.fb.array([]),
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
    this.buscarFornecedor();
  }

  filterOptions(): void {
    const query = this.myControl.value?.toLowerCase() || '';
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }

  selectOption(option: string): void {
    this.formulario.patchValue({ fornecedor: option });
    this.myControl.setValue(option);
    this.filteredOptions = [];
  }

  carregarDados(financPagar: any) {
    while (this.subFinancPagar.length !== 0) {
      this.subFinancPagar.removeAt(0);
    }

    this.formulario.patchValue(this.data);

    const fornecedorAtual =
      financPagar?.fornecedor ||
      this.listaFornecedores.find((f) => f.id === financPagar?.fornecedorId);

    if (fornecedorAtual) {
      this.searchTerm =
        fornecedorAtual.nome ||
        fornecedorAtual.razao ||
        fornecedorAtual.fantasia ||
        '';
      this.formulario.patchValue({ fornecedorId: fornecedorAtual.id });
    }

    let dataEmissao = this.formulario.get('dataEmissao')?.value;

    if (dataEmissao) {
      dataEmissao = this.datePipe.formatToHtmlDate(dataEmissao);
      this.formulario.patchValue({ dataEmissao });
    }

    if (this.data.subFinancPagar && this.data.subFinancPagar.length > 0) {
      this.data.subFinancPagar.forEach((subFinanc) => {
        let dataVencimento: any = subFinanc.dataVencimento;
        if (dataVencimento) {
          dataVencimento = this.datePipe.formatToHtmlDate(dataVencimento);
        }

        let dataPagamento: any = subFinanc.dataPagamento;
        if (dataPagamento) {
          dataPagamento = this.datePipe.formatToHtmlDate(dataPagamento);
        }

        this.subFinancPagar.push(
          this.fb.group({
            id: [subFinanc.id],
            financReceberId: [subFinanc.financPagarId],
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
  }

  fecharModal() {
    let btnCancelar = document.getElementById('btnCancelar') as HTMLElement;
    this.formulario.reset();
    this.subFinancPagar.clear();
    this.searchTerm = '';
    this.filteredFornecedores = [];
    this.formulario
      .get('dataEmissao')
      ?.setValue(this.datePipe.formatToHtmlDate(new Date()));
    btnCancelar.click();
  }

  onSubmit() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const dadosToSave: FinancPagar = this.formulario.value as FinancPagar;

      this.isLoading = true;
      const saveOperation = dadosToSave.id
        ? this.financPagarService.Atualizar(dadosToSave)
        : this.financPagarService.Criar(dadosToSave);
      saveOperation.subscribe({
        next: (response) => {
          this.isLoading = false;
          const action = dadosToSave.id ? 'atualizada' : 'criada';

          if (!response.status) {
            this.toast.error(response.mensagem, 'Erro');
            return;
          }

          this.toast.success(
            `Conta a pagar ${action} com sucesso!`,
            'Parabéns'
          );
          this.dadosAtualizado.emit();
          // btnCancelar.click();
          let inputFornecedorPesquisado = document.getElementById(
            'fornecedor'
          ) as HTMLInputElement;
          inputFornecedorPesquisado.value = '';
          this.fecharModal();
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
        }
      });
    } else {
      this.formulario.markAllAsTouched();
      this.toast.error(
        'Por favor, preencha todos os campos obrigatórios',
        'Erro'
      );
      this.isLoading = false;
    }
  }

  get subFinancPagar(): FormArray {
    return this.formulario.get('subFinancPagar') as FormArray;
  }

  gerarParcelas(): void {
    this.subFinancPagar.clear();

    const valorTotal = this.formulario.get('valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('parcela')?.value || 1;
    const valorBase = Math.floor((valorTotal / quantidadeParcelas) * 100) / 100;
    const totalBase = valorBase * quantidadeParcelas;
    const diferenca = parseFloat((valorTotal - totalBase).toFixed(2));

    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      const valor = i === quantidadeParcelas - 1 ? parseFloat((valorBase + diferenca).toFixed(2)) : valorBase;

      this.subFinancPagar.push(
        this.fb.group({
          id: [null],
          financPagarId: [null],
          parcela: [i + 1],
          valor: [valor, [Validators.required, Validators.min(0)]],
          dataVencimento: [
            DateHelper.formatDateLocal(dataVencimento),
            Validators.required,
          ],
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
    this.formulario.get('parcela')?.setValue(1);

    if (tipoPagamentoId == '1') {
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
        this.errorMessage =
          'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      },
    });
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
        this.errorMessage =
          'Erro ao carregar os forma de pagamento. Tente novamente mais tarde.';
      },
    });
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
        this.errorMessage =
          'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      },
    });
  }

  buscarFornecedor(): void {
    this.fornecedorService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaFornecedores = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar fornecedores:', err);
        this.errorMessage =
          'Erro ao carregar os fornecedores. Tente novamente mais tarde.';
      },
    });
  }

  selectFornecedor(fornecedor: Fornecedor): void {
    this.formulario.patchValue({
      fornecedorId: fornecedor.id,
    });
    this.searchTerm = fornecedor.nome || fornecedor.razao || fornecedor.fantasia || '';
    this.filteredFornecedores = [];
  }

  onSearch(): void {
    if (this.searchTerm.length >= 3) {
      const term = this.searchTerm.toLowerCase();
      this.filteredFornecedores = this.listaFornecedores.filter(
        (fornecedor) =>
          fornecedor.nome?.toLowerCase().includes(term) ||
          fornecedor.razao?.toLowerCase().includes(term) ||
          fornecedor.fantasia?.toLowerCase().includes(term) ||
          fornecedor.cpf?.includes(this.searchTerm) ||
          fornecedor.cnpj?.includes(this.searchTerm) ||
          fornecedor.celular?.includes(this.searchTerm)
      );
    } else {
      this.filteredFornecedores = [];
    }
  }
}
