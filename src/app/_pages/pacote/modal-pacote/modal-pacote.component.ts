import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Pacote } from '../../../_module/pacoteModule';
import { PacoteService } from '../../../_services/pacote.service';
import { ProcedimentoService } from '../../../_services/procedimento.service';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';


@Component({
  selector: 'app-modal-pacote',
  templateUrl: './modal-pacote.component.html',
  styleUrls: ['./modal-pacote.component.css']
})
export class ModalPacoteComponent {
  constructor(
    private pacoteService: PacoteService,
    private toast: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private procedimentoService: ProcedimentoService,
    private centroCustoService: CentroDeCustoService
  ) {
    this.formulario = this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      procedimentoId: [null, Validators.required],
      quantidadeSessoes: [1, [Validators.required, Validators.min(1)]],
      valor: ['0,00', Validators.required],
      centroCustoId: [null],
      observacao: [''],
      ativo: [true]
    });
  }

  @ViewChild('modalPacote') modalPacote?: ElementRef;
  @Input() pacote = {} as Pacote;
  @Output() dataAtualizado = new EventEmitter<void>();

  isLoading = false;
  formulario: FormGroup;
  listaProcedimento: any[] = [];
  listaCentroCusto: any[] = [];

  ngOnInit() {
    this.getProcedimento();
    this.getCentroCusto();
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios', 'Formulário Inválido');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as Pacote;

    const saveOperation = dataToSave.id
      ? this.pacoteService.Atualizar(dataToSave, 1, 10)
      : this.pacoteService.Criar(dataToSave, 1, 10);

    saveOperation.subscribe({
      next: (response) => {
        this.isLoading = false;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (!response.status) {
          this.toast.error(response.mensagem, 'Erro');
          return;
        }

        this.toast.success(`Pacote ${action} com sucesso!`, 'Parabéns');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }

  carregarData(pacote: any) {
    this.formulario.patchValue(this.pacote);
  }

  fecharModal() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset({
      id: null,
      descricao: '',
      procedimentoId: null,
      quantidadeSessoes: 1,
      valor: '0,00',
      centroCustoId: null,
      observacao: '',
      ativo: true
    });
    btnCancelar.click();
  }

  getProcedimento() {
    this.procedimentoService.Listar(undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProcedimento = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Procedimento:', err);
      },
    });
  }

  getCentroCusto() {
    this.centroCustoService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaCentroCusto = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Centro de Custo:', err);
      },
    });
  }
}