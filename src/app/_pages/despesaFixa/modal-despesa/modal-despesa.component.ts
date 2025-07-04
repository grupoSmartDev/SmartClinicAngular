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

  // Opções de frequência
  frequenciaOptions = [
    { valor: 1, texto: 'Mensal' },
    { valor: 3, texto: 'Trimestral' },
    { valor: 6, texto: 'Semestral' },
    { valor: 12, texto: 'Anual' }
  ];

  formulario: FormGroup;

  constructor(
    private toast: ToastrService,
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
      descricao: ["", [Validators.required, Validators.maxLength(150)]],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      diaVencimento: [1, [Validators.required, Validators.min(1), Validators.max(31)]],
      dataInicio: [null, Validators.required],
      dataFim: [null], // Não obrigatório - se não informar, gera 12 parcelas
      ativo: [true], // Default true
      frequencia: [1, Validators.required],
      fornecedorId: [null], // Opcional
      planoContaId: [null, Validators.required],
      centroCustoId: [null, Validators.required],
      formaPagamentoId: [null, Validators.required],
      tipoPagamentoId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.carregarDadosIniciais();
    this.carregarDespesa(this.despesa);
  }

  async carregarDadosIniciais() {
    this.isLoading = true;

    try {
      // Carrega todos os dados necessários em paralelo
      await Promise.all([
        this.getCentroCusto(),
        this.getPlanoContas(),
        this.getFormaPagamento(),
        this.getTipoPagamento(),
        this.getFornecedor()
      ]);
    } catch (error) {
      this.toast.error('Erro ao carregar dados iniciais', 'Erro');
    } finally {
      this.isLoading = false;
    }
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Por favor, preencha todos os campos obrigatórios', 'Erro');
      return;
    }

    // Validações customizadas
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;
    const dataToSave = this.prepararDadosParaEnvio();

    const saveOperation = this.despesa.id
      ? this.despesaService.Atualizar(dataToSave)
      : this.despesaService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        const action = dataToSave.id ? 'atualizada' : 'criada';

        if (response.status) {
          this.toast.success(
            `Despesa ${action} com sucesso! ${response.mensagem}`,
            'Parabéns'
          );
          this.dadosAtualizados.emit();
          this.fecharModal();
        } else {
          this.toast.error(response.mensagem, 'Erro');
        }
      },
      error: (error) => {
        console.error('Erro ao salvar despesa:', error);
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  validarFormulario(): boolean {
    const dataInicio = this.formulario.get('dataInicio')?.value;
    const dataFim = this.formulario.get('dataFim')?.value;

    // Validar se data fim é maior que data início
    if (dataFim && dataInicio && new Date(dataFim) <= new Date(dataInicio)) {
      this.toast.error('Data fim deve ser maior que data início', 'Erro');
      return false;
    }

    // Validar dia do vencimento
    const diaVencimento = this.formulario.get('diaVencimento')?.value;
    if (diaVencimento && (diaVencimento < 1 || diaVencimento > 31)) {
      this.toast.error('Dia de vencimento deve estar entre 1 e 31', 'Erro');
      return false;
    }

    return true;
  }

  prepararDadosParaEnvio(): DespesaFixa {
    const formData = { ...this.formulario.value };

    // Converter valores para os tipos corretos
    if (formData.valor) {
      formData.valor = parseFloat(formData.valor);
    }

    if (formData.diaVencimento) {
      formData.diaVencimento = parseInt(formData.diaVencimento);
    }

    if (formData.frequencia) {
      formData.frequencia = parseInt(formData.frequencia);
    }

    // Converter datas para o formato correto se necessário
    if (formData.dataInicio) {
      formData.dataInicio = this.formatarDataParaEnvio(formData.dataInicio);
    }

    if (formData.dataFim) {
      formData.dataFim = this.formatarDataParaEnvio(formData.dataFim);
    }

    // Remover campos null/undefined desnecessários
    Object.keys(formData).forEach(key => {
      if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
        delete formData[key];
      }
    });

    return formData;
  }

  formatarDataParaEnvio(data: any): string {
    if (!data) return '';

    // Se já é uma string no formato correto, retorna
    if (typeof data === 'string') {
      return data;
    }

    // Se é um objeto Date, converte para ISO string
    if (data instanceof Date) {
      return data.toISOString();
    }

    return data;
  }

  carregarDespesa(despesa: DespesaFixa) {
    if (despesa && despesa.id) {
      // Formatar datas para o input date (YYYY-MM-DD)
      const despesaFormatada = { ...despesa };

      if (despesa.dataInicio) {
        despesaFormatada.dataInicio = this.formatarDataParaInput(despesa.dataInicio);
      }

      if (despesa.dataFim) {
        despesaFormatada.dataFim = this.formatarDataParaInput(despesa.dataFim);
      }

      this.formulario.patchValue(despesaFormatada);
    } else {
      // Resetar formulário para novo registro
      this.formulario.reset({
        ativo: true,
        frequencia: 1,
        diaVencimento: 1,
        valor: 0
      });
    }
  }

  formatarDataParaInput(data: any): string {
    if (!data) return '';

    const date = new Date(data);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  }

  fecharModal() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset({
      ativo: true,
      frequencia: 1,
      diaVencimento: 1,
      valor: 0
    });
    btnCancelar?.click();
  }

  // Métodos para carregar dados dos selects
  async getTipoPagamento(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tipoPagamentoService.ListarTipoPagamento().subscribe({
        next: (response) => {
          this.tipoPagamentos = response.dados || [];
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar tipos de pagamento:', error);
          this.toast.error('Erro ao carregar tipos de pagamento', 'Erro');
          reject(error);
        }
      });
    });
  }

  async getFormaPagamento(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.formaPagamentoService.Listar().subscribe({
        next: (response) => {
          this.formaPagamentos = response.dados || [];
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar formas de pagamento:', error);
          this.toast.error('Erro ao carregar formas de pagamento', 'Erro');
          reject(error);
        }
      });
    });
  }

  async getCentroCusto(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.centroCustoService.Listar().subscribe({
        next: (response) => {
          this.centroCustos = response.dados || [];
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar centros de custo:', error);
          this.toast.error('Erro ao carregar centros de custo', 'Erro');
          reject(error);
        }
      });
    });
  }

  async getPlanoContas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.planoContasService.Listar().subscribe({
        next: (response) => {
          this.planoContas = response.dados || [];
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar planos de contas:', error);
          this.toast.error('Erro ao carregar planos de contas', 'Erro');
          reject(error);
        }
      });
    });
  }

  async getFornecedor(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fornecedorService.Listar().subscribe({
        next: (response) => {
          this.fornecedores = response.dados || [];
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar fornecedores:', error);
          this.toast.error('Erro ao carregar fornecedores', 'Erro');
          reject(error);
        }
      });
    });
  }

  // Métodos auxiliares para o template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.formulario.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.formulario.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} é obrigatório`;
      if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}