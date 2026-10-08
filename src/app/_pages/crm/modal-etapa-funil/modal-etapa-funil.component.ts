import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { EtapaFunilService } from '../../../_services/crm/etapa-funil.service';
import { TabService } from '../../../_services/tabs.service';
import { EtapaFunil, EtapaFunilEdicaoDto, EtapaFunilOrdemDto } from '../../../_module/crmModule';
import { CrmHelpers } from '../crm-helpers';

@Component({
  selector: 'app-modal-etapa-funil',
  templateUrl: './modal-etapa-funil.component.html',
  styleUrl: './modal-etapa-funil.component.css'
})
export class ModalEtapaFunilComponent {
  constructor(
    private etapaFunilService: EtapaFunilService,
    private tabService: TabService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [''],
      cor: [this.COR_PADRAO],
      scriptSugerido: [''],
      ordem: [null]
    });
  }

  @Output() dataAtualizado = new EventEmitter<void>();

  private readonly MODAL_ID = 'modalEtapaFunil';
  private readonly COR_PADRAO = '#3B82F6';
  readonly helpers = CrmHelpers;

  formulario: FormGroup;
  lista: EtapaFunil[] = [];
  etapaEmEdicao: EtapaFunil | null = null;
  isLoading = false;
  isReordenando = false;
  etapaParaExcluir: number | null = null;

  abrir(): void {
    this.limparFormulario();
    this.etapaParaExcluir = null;
    this.carregar();
    const el = document.getElementById(this.MODAL_ID);
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
  }

  fecharModal(): void {
    const el = document.getElementById(this.MODAL_ID);
    if (el) bootstrap.Modal.getInstance(el)?.hide();
    this.limparFormulario();
  }

  carregar(): void {
    this.etapaFunilService.Listar().subscribe({
      next: (response) => {
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao carregar etapas', 'Erro');
          return;
        }
        this.lista = response.dados ?? [];
      },
      error: (err) => this.toast.error(err.error?.mensagem || 'Erro ao carregar etapas', 'Erro')
    });
  }

  get isEdicao(): boolean {
    return !!this.formulario.get('id')?.value;
  }

  // Etapa fixa em edição: só o script sugerido pode ser alterado
  get isFixaEmEdicao(): boolean {
    return !!this.etapaEmEdicao?.isFixa;
  }

  // Etapas customizadas na ordem atual da lista (usado nos botões ↑ ↓)
  get customizadas(): EtapaFunil[] {
    return this.lista.filter(e => !e.isFixa);
  }

  limparFormulario(): void {
    this.etapaEmEdicao = null;
    this.formulario.reset({ id: null, nome: '', cor: this.COR_PADRAO, scriptSugerido: '', ordem: null });
  }

  editar(etapa: EtapaFunil): void {
    this.etapaEmEdicao = etapa;
    this.formulario.patchValue({
      id: etapa.id,
      nome: etapa.nome,
      cor: etapa.cor || this.COR_PADRAO,
      scriptSugerido: etapa.scriptSugerido || '',
      ordem: etapa.ordem
    });
  }

  private aposMutacao(lista: EtapaFunil[] | null | undefined, mensagem: string): void {
    this.lista = lista ?? [];
    this.toast.success(mensagem, 'Sucesso');
    this.tabService.clearCacheByPrefix('crm-kanban-'); // colunas do Kanban mudaram
    this.dataAtualizado.emit();
  }

  onSubmit(): void {
    if (this.isFixaEmEdicao) {
      this.salvarScriptEtapaFixa(this.etapaEmEdicao!);
      return;
    }

    const v = this.formulario.value;
    if (!v.nome?.trim()) {
      this.toast.error('Informe o nome da etapa.', 'Campo obrigatório');
      return;
    }

    this.isLoading = true;
    const operacao = this.isEdicao
      ? this.etapaFunilService.Editar({
          id: v.id,
          nome: v.nome.trim(),
          cor: v.cor,
          scriptSugerido: v.scriptSugerido || null,
          ordem: Number(v.ordem) || 0
        })
      : this.etapaFunilService.Criar({
          nome: v.nome.trim(),
          cor: v.cor,
          scriptSugerido: v.scriptSugerido || null
          // ordem omitida → backend coloca no final da fila
        });

    operacao.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao salvar etapa', 'Erro');
          return;
        }
        this.aposMutacao(response.dados, this.isEdicao ? 'Etapa atualizada!' : 'Etapa criada!');
        this.limparFormulario();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.mensagem || 'Erro ao salvar etapa', 'Erro');
      }
    });
  }

  // Etapa fixa: nome/ordem originais da etapa + cor e script do form.
  // O backend ignora nome e ordem das fixas e altera só Cor e ScriptSugerido.
  salvarScriptEtapaFixa(etapa: EtapaFunil): void {
    const payload: EtapaFunilEdicaoDto = {
      id: etapa.id,
      nome: etapa.nome,
      cor: this.formulario.get('cor')?.value || etapa.cor,
      scriptSugerido: this.formulario.get('scriptSugerido')?.value?.trim() || null,
      ordem: etapa.ordem
    };

    this.isLoading = true;
    this.etapaFunilService.Editar(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao salvar o script', 'Erro');
          return;
        }
        this.aposMutacao(response.dados, 'Script da etapa atualizado!');
        this.limparFormulario();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.mensagem || 'Erro ao salvar o script', 'Erro');
      }
    });
  }

  excluir(id: number): void {
    this.etapaFunilService.Delete(id).subscribe({
      next: (response) => {
        this.etapaParaExcluir = null;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao excluir etapa', 'Erro');
          return;
        }
        if (this.formulario.get('id')?.value === id) this.limparFormulario();
        this.aposMutacao(response.dados, 'Etapa excluída!');
      },
      error: (err) => {
        this.etapaParaExcluir = null;
        this.toast.error(err.error?.mensagem || 'Erro ao excluir etapa', 'Erro');
      }
    });
  }

  podeMover(etapa: EtapaFunil, direcao: -1 | 1): boolean {
    const idx = this.customizadas.findIndex(e => e.id === etapa.id);
    const alvo = idx + direcao;
    return idx >= 0 && alvo >= 0 && alvo < this.customizadas.length;
  }

  // Troca a posição com a etapa customizada vizinha. As fixas não mudam de lugar:
  // reaproveita os valores de ordem já usados pelas customizadas (garantindo que sejam distintos).
  mover(etapa: EtapaFunil, direcao: -1 | 1): void {
    if (!this.podeMover(etapa, direcao) || this.isReordenando) return;

    const custom = [...this.customizadas];
    const idx = custom.findIndex(e => e.id === etapa.id);
    [custom[idx], custom[idx + direcao]] = [custom[idx + direcao], custom[idx]];

    const ordens = this.customizadas.map(e => e.ordem).sort((a, b) => a - b);
    for (let i = 1; i < ordens.length; i++) {
      if (ordens[i] <= ordens[i - 1]) ordens[i] = ordens[i - 1] + 1;
    }

    const payload: EtapaFunilOrdemDto[] = custom.map((e, i) => ({ id: e.id, ordem: ordens[i] }));

    this.isReordenando = true;
    this.etapaFunilService.Reordenar(payload).subscribe({
      next: (response) => {
        this.isReordenando = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao reordenar', 'Erro');
          return;
        }
        this.aposMutacao(response.dados, 'Ordem atualizada!');
      },
      error: (err) => {
        this.isReordenando = false;
        this.toast.error(err.error?.mensagem || 'Erro ao reordenar', 'Erro');
      }
    });
  }
}
