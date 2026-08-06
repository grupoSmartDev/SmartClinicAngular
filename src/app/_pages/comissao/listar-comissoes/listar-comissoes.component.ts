import { Component } from '@angular/core';
import { ComissaoCalculada, ComissaoResumo, ComissaoService, StatusComissao, TipoComissao } from '../../../_services/comissao-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { Profissional } from '../../../_module/profissionalModule';
import { DateHelper } from '../../../_shared/helpers/date-helper';

@Component({
  selector: 'app-listar-comissoes',
  templateUrl: './listar-comissoes.component.html',
  styleUrl: './listar-comissoes.component.css'
})
export class ListarComissoesComponent {
  filtroForm!: FormGroup;
  comissoes: ComissaoCalculada[] = [];
  profissionais: Profissional[] = [];
  resumo?: ComissaoResumo;

  // Estados de loading
  isLoading = false;
  isCalculating = false;
  isPagando = false;

  // Seleção
  comissoesSelecionadas: number[] = [];

  constructor(
    private fb: FormBuilder,
    private comissaoService: ComissaoService,
    private profissionalService: ProfissionalService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.carregarProfissionais();
    this.definirPeriodoPadrao();
  }

  initForm(): void {
    this.filtroForm = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      profissionalId: [''],
      status: ['']
    });
  }

  definirPeriodoPadrao(): void {
    const hoje = new Date();
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    this.filtroForm.patchValue({
      dataInicio: DateHelper.formatDateLocal(primeiroDiaDoMes),
      dataFim: DateHelper.formatDateLocal(hoje)
    });

    // Buscar automaticamente
    this.buscarComissoes();
  }

  carregarProfissionais(): void {
    this.profissionalService.Listar().subscribe({
      next: (response) => {
        if (response.status && response.dados) {
          this.profissionais = response.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.toast.error('Erro ao carregar lista de profissionais', 'Erro');
      }
    });
  }

  calcularComissoes(): void {
    if (this.filtroForm.invalid) {
      this.filtroForm.markAllAsTouched();
      this.toast.error('Preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isCalculating = true;
    const formValue = this.filtroForm.value;

    const dto = {
      dataInicio: new Date(formValue.dataInicio),
      dataFim: new Date(formValue.dataFim),
      profissionalId: formValue.profissionalId || undefined
    };

    this.comissaoService.calcularComissoes(dto).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success(response.mensagem, 'Sucesso');
          this.buscarComissoes(); // Recarregar lista
        } else {
          this.toast.error(response.mensagem, 'Erro');
        }
      },
      error: (err) => {
        console.error('Erro ao calcular comissões:', err);
        this.toast.error('Erro ao calcular comissões', 'Erro');
      },
      complete: () => {
        this.isCalculating = false;
      }
    });
  }

  buscarComissoes(): void {
    if (this.filtroForm.invalid) {
      this.filtroForm.markAllAsTouched();
      this.toast.error('Preencha os campos obrigatórios', 'Erro');
      return;
    }

    this.isLoading = true;
    this.limparSelecao();

    const formValue = this.filtroForm.value;
    const dataInicio = new Date(formValue.dataInicio);
    const dataFim = new Date(formValue.dataFim);
    const status = formValue.status ? parseInt(formValue.status) : undefined;
    const profissionalId = formValue.profissionalId || undefined;

    // Buscar comissões e resumo em paralelo
    Promise.all([
      this.comissaoService.listarComissoes(dataInicio, dataFim, status, profissionalId).toPromise(),
      this.comissaoService.obterResumo(dataInicio, dataFim, profissionalId).toPromise()
    ]).then(([comissoesResponse, resumoResponse]) => {
      // Processar comissões
      if (comissoesResponse?.status && comissoesResponse.dados) {
        this.comissoes = comissoesResponse.dados;
      } else {
        this.comissoes = [];
        if (comissoesResponse?.mensagem) {
          this.toast.info(comissoesResponse.mensagem, 'Informação');
        }
      }

      // Processar resumo
      if (resumoResponse?.status && resumoResponse.dados) {
        this.resumo = resumoResponse.dados;
      }

    }).catch((err) => {
      console.error('Erro ao buscar dados:', err);
      this.toast.error('Erro ao buscar comissões', 'Erro');
      this.comissoes = [];
      this.resumo = undefined;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  darBaixaComissoes(): void {
    if (this.comissoesSelecionadas.length === 0) {
      this.toast.warning('Selecione pelo menos uma comissão', 'Atenção');
      return;
    }

    // Verificar se todas são pendentes
    const comissoesPendentes = this.comissoes.filter(c =>
      this.comissoesSelecionadas.includes(c.id) && c.status === "Pendente"
    );

    if (comissoesPendentes.length !== this.comissoesSelecionadas.length) {
      this.toast.error('Só é possível dar baixa em comissões pendentes', 'Erro');
      return;
    }

    this.isPagando = true;

    this.comissaoService.darBaixaComissoes(this.comissoesSelecionadas).subscribe({
      next: (response) => {
        if (response.status) {
          this.toast.success(response.mensagem, 'Sucesso');
          this.buscarComissoes(); // Recarregar lista
          this.limparSelecao();
        } else {
          this.toast.error(response.mensagem, 'Erro');
        }
      },
      error: (err) => {
        console.error('Erro ao dar baixa:', err);
        this.toast.error('Erro ao processar pagamento das comissões', 'Erro');
      },
      complete: () => {
        this.isPagando = false;
      }
    });
  }

  // Métodos de seleção
  toggleSelecao(comissao: ComissaoCalculada): void {
    if (comissao.status !== "Pendente") {
      return; // Só permite selecionar pendentes
    }

    const index = this.comissoesSelecionadas.indexOf(comissao.id);
    if (index === -1) {
      this.comissoesSelecionadas.push(comissao.id);
    } else {
      this.comissoesSelecionadas.splice(index, 1);
    }
  }

  toggleTodos(event: any): void {
    const checked = event.target.checked;

    if (checked) {
      // Selecionar todas as pendentes
      this.comissoesSelecionadas = this.comissoes
        .filter(c => c.status === "Pendente")
        .map(c => c.id);
    } else {
      // Limpar seleção
      this.limparSelecao();
    }
  }

  isSelecionada(id: number): boolean {
    return this.comissoesSelecionadas.includes(id);
  }

  limparSelecao(): void {
    this.comissoesSelecionadas = [];
  }

  // Getters para template
  get todosSelecionados(): boolean {
    const pendentes = this.comissoes.filter(c => c.status === "Pendente");
    return pendentes.length > 0 && pendentes.every(c => this.isSelecionada(c.id));
  }

  get algunsSelecionados(): boolean {
    const pendentes = this.comissoes.filter(c => c.status === "Pendente");
    return this.comissoesSelecionadas.length > 0 && !this.todosSelecionados;
  }

  get valorSelecionado(): number {
    return this.comissoes
      .filter(c => this.isSelecionada(c.id))
      .reduce((total, c) => total + c.valorComissao, 0);
  }

  // Métodos auxiliares para template
  getStatusText(status: string): string {
    return this.comissaoService.getStatusText(status);
  }

  getTipoComissaoText(tipo: string | String): string {
    return this.comissaoService.getTipoComissaoText(tipo);
  }

  getStatusClass(status: string): string {
    return this.comissaoService.getStatusClass(status);
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.definirPeriodoPadrao();
  }
}