import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AtividadeService } from '../../../_services/atividade.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Atividade } from '../../../_module/atividadeModule';
import { ResponseModel } from '../../../_module/ResponseModule';

@Component({
  selector: 'app-modal-atividade',
  templateUrl: './modal-atividade.component.html',
  styleUrl: './modal-atividade.component.css'
})
export class ModalAtividadeComponent {
  constructor(
    private atividadeService: AtividadeService,
    private toast: ToastrService,
    private fb : FormBuilder) { }

  @ViewChild('modalSala') modalSala?: ElementRef;
  @Input() data = {} as Atividade;
  @Output() dataAtualizada = new EventEmitter<void>(); // Adicione este EventEmitter

  formulario! : FormGroup;

    ngOnInit(): void {
      this.criarFormulario();
    }

  criarFormulario() : void{
    this.formulario = this.fb.group({
      id : [''],
      titulo : ['', Validators.required],
      descricao : [''],
      tempo : [],
    })
  }

  carregarDados(atividade: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const dadosParaSalvar: Atividade = this.formulario.value as Atividade;
      if (dadosParaSalvar.id) {
        this.atividadeService.Atualizar(dadosParaSalvar).subscribe({
          next: (response: ResponseModel<Atividade>) => {
            this.toast.success('Atividade atualizado com Sucesso', 'Parabéns');
            this.dataAtualizada.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar uma Sala');
          }
        });
      } else {
        this.atividadeService.Criar(dadosParaSalvar).subscribe({
          next: (response: ResponseModel<Atividade>) => {
            this.toast.success('Atividade Criado com sucesso', 'Parabéns');
            this.dataAtualizada.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar atividade:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar uma atividade');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  testeEnvio(){
    console.log('dados formulario',this.formulario.value)
  }
}
