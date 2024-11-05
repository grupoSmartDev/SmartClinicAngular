import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Profissional } from '../../../_module/profissionalModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-profissional',
  templateUrl: './modal-profissional.component.html',
  styleUrl: './modal-profissional.component.css'
})
export class ModalProfissionalComponent {
  constructor(
    private profissionalService: ProfissionalService,
    private toast: ToastrService,
    private router: Router,
  ) { }

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() profissional = {} as Profissional;
  @Output() dataAtualizado = new EventEmitter<void>(); // Adicione este EventEmitter

  lista: Profissional[] = [];

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    centroCustoId: new FormControl()
  })

  ngOnInit() {
    this.carregarCC();
  }

  onSubmit() {
    
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const profissionalToSave: Profissional = this.formulario.value as Profissional;
      if (profissionalToSave.id) {
        this.profissionalService.Atualizar(profissionalToSave).subscribe({
          next: (response: ResponseModel<Profissional>) => {
            this.toast.success('Profissional atualizado com Sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar Profissional');
          }
        });
      } else {
        this.profissionalService.Criar(profissionalToSave).subscribe({
          next: (response: ResponseModel<Profissional>) => {
            this.toast.success('Profissional Criado com sucesso', 'Parabéns');
            this.dataAtualizado.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar Profissional:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar Profissional');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarData(centroDeCusto: any) {
    this.formulario.patchValue(this.profissional);
  }

  fecharModal() {
    this.formulario.reset();
  }

  carregarCC(): void {
    this.profissionalService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
    })
  }
}
