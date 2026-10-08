import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { CampanhaService } from '../../../_services/crm/campanha.service';
import { Campanha, PLATAFORMAS_CAMPANHA } from '../../../_module/crmModule';

@Component({
  selector: 'app-modal-campanha',
  templateUrl: './modal-campanha.component.html'
})
export class ModalCampanhaComponent {
  constructor(
    private campanhaService: CampanhaService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [''],
      plataforma: [null],
      idExterno: ['']
    });
  }

  @Output() dataAtualizado = new EventEmitter<void>();

  private readonly MODAL_ID = 'modalCampanha';
  readonly plataformas = PLATAFORMAS_CAMPANHA;

  formulario: FormGroup;
  lista: Campanha[] = [];
  isLoading = false;
  campanhaParaExcluir: number | null = null;

  abrir(): void {
    this.limparFormulario();
    this.campanhaParaExcluir = null;
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
    this.campanhaService.Listar().subscribe({
      next: (response) => {
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao carregar campanhas', 'Erro');
          return;
        }
        this.lista = response.dados ?? [];
      },
      error: (err) => this.toast.error(err.error?.mensagem || 'Erro ao carregar campanhas', 'Erro')
    });
  }

  get isEdicao(): boolean {
    return !!this.formulario.get('id')?.value;
  }

  limparFormulario(): void {
    this.formulario.reset({ id: null, nome: '', plataforma: null, idExterno: '' });
  }

  editar(campanha: Campanha): void {
    this.formulario.patchValue({
      id: campanha.id,
      nome: campanha.nome,
      plataforma: campanha.plataforma || null,
      idExterno: campanha.idExterno || ''
    });
  }

  onSubmit(): void {
    const v = this.formulario.value;
    if (!v.nome?.trim()) {
      this.toast.error('Informe o nome da campanha.', 'Campo obrigatório');
      return;
    }

    const dto = {
      nome: v.nome.trim(),
      plataforma: v.plataforma || null,
      idExterno: v.idExterno?.trim() || null
    };

    this.isLoading = true;
    const operacao = this.isEdicao
      ? this.campanhaService.Editar({ id: v.id, ...dto })
      : this.campanhaService.Criar(dto);

    operacao.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao salvar campanha', 'Erro');
          return;
        }
        this.toast.success(this.isEdicao ? 'Campanha atualizada!' : 'Campanha criada!', 'Sucesso');
        this.lista = response.dados ?? [];
        this.limparFormulario();
        this.dataAtualizado.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.mensagem || 'Erro ao salvar campanha', 'Erro');
      }
    });
  }

  excluir(id: number): void {
    this.campanhaService.Delete(id).subscribe({
      next: (response) => {
        this.campanhaParaExcluir = null;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao excluir campanha', 'Erro');
          return;
        }
        if (this.formulario.get('id')?.value === id) this.limparFormulario();
        this.toast.success('Campanha excluída!', 'Sucesso');
        this.lista = response.dados ?? [];
        this.dataAtualizado.emit();
      },
      error: (err) => {
        this.campanhaParaExcluir = null;
        this.toast.error(err.error?.mensagem || 'Erro ao excluir campanha', 'Erro');
      }
    });
  }
}
