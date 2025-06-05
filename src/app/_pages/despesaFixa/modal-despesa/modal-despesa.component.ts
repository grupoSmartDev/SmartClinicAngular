import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DespesaFixaService } from '../../../_services/despesa-fixa.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DespesaFixa } from '../../../_module/despesaFixaModule';
import { Fornecedor } from '../../../_module/fornecedorModule';
import { PlanoContas } from '../../../_module/planoContasModule';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { PlanoContasService } from '../../../_services/plano-contas.service';
import { FornecedorService } from '../../../_services/fornecedor.service';

@Component({
  selector: 'app-modal-despesa',
  templateUrl: './modal-despesa.component.html',
  styleUrl: './modal-despesa.component.css'
})
export class ModalDespesaComponent {
  @Input() despesa = {} as DespesaFixa;
  @Output() dadosAtualizados = new EventEmitter<void>();
  isLoading = false;
  fornecedores: Fornecedor[] = [];
  planoContas: PlanoContas[] = [];
  centroCustos: CentroDeCusto[] = [];
  tipoPagamentos: TipoPagamento[] = [];
  formaPagamentos: FormaPagamento[] = [];

  constructor(private toast: ToastrService,
    private despesaService: DespesaFixaService,
    private centroCustoService: CentroDeCustoService,
    private planoContasService: PlanoContasService,
    private fornecedorService: FornecedorService,
    private tipoPagamentoService: TipoPagamentoService,
    private formaPagamentoService: FormaPagamentoService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      descricao: ["", Validators.required],
      valor: [0, Validators.required],
      diaVencimento: [null, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      ativo: [false],
      frequencia: [1, Validators.required],
      fornecedorId: [null],
      planoContaId: [null, Validators.required],
      centroCustoId: [null, Validators.required],
      formaPagamentoId: [null, Validators.required],
      tipoPagamentoId: [null, Validators.required],
    })
  }

  formulario: FormGroup;

  ngOnInit() {
    this.carregarDespesa(this.despesa);
    this.getCetroCusto();
    this.getPlanoContas();
    this.getFormaPagamento();
    this.getTipoPagamento();
    this.getFornecedor();
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
      return;
    }

    const dataToSave = this.formulario.value as DespesaFixa;

    const saveOperation = this.despesa.id ? this.despesaService.Atualizar(dataToSave) : this.despesaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        let status = response.status;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (status) {
          this.toast.success(`Despesa ${action} com sucesso!`, 'Parabéns');
        }
        else {
          this.toast.error(response.mensagem, 'Erro');
        }
        this.dadosAtualizados.emit();
        this.fecharModal();

      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });


  }

  carregarDespesa(despesa: any) {
    this.formulario.patchValue(this.despesa);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }

  getTipoPagamento() {
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (response) => {
        this.tipoPagamentos = response.dados;
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao buscar os tipos de pagamento. Tente novamente.', 'Erro');
      },
    });
  }

  getFormaPagamento() {
    this.formaPagamentoService.Listar().subscribe({
      next: (response) => {
        this.formaPagamentos = response.dados;
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao buscar as formas de pagamento. Tente novamente.', 'Erro');
      },
    });
  }

  getCetroCusto() {
    this.centroCustoService.Listar().subscribe({
      next: (response) => {
        this.centroCustos = response.dados;
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao buscar por centro de custos. Tente novamente.', 'Erro');
      },
    });
  }

  getPlanoContas() {
    this.planoContasService.Listar().subscribe({
      next: (response) => {

        this.planoContas = response.dados;
      },
      error: (response) => {
        this.toast.error("Erro ao tentar buscar por Plano de contas", 'Erro');
      },
    });
  }

  getFornecedor() {
    this.fornecedorService.Listar().subscribe({
      next: (response) => {
        this.fornecedores = response.dados;
      },
      error: () => {
        this.toast.error("Erro ao tentar buscar por fornecedores", 'Erro');
      },
    });
  }
}
