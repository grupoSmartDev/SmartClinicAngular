import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Profissional } from '../../../_module/profissionalModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) { }

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() profissional = {} as Profissional;
  @Output() dataAtualizado = new EventEmitter<void>(); 

  lista: Profissional[] = [];

  formulario = new FormGroup({
    id: new FormControl(),
    email: new FormControl(),
    nome: new FormControl(),
    cpf: new FormControl(),
    celular: new FormControl(),
    sexo: new FormControl(),
    conselhoId: new FormControl(),
    registroConselho: new FormControl(),
    ufConselho: new FormControl(),
    profissaoId: new FormControl(),
    cbo: new FormControl(),
    rqe: new FormControl(),
    cnes: new FormControl(),
  
    // Propriedades para pagamento
    tipoPagamento: new FormControl(),
    chavePix: new FormControl(),
    bancoNome: new FormControl(),
    bancoAgencia: new FormControl(),
    bancoConta: new FormControl(),
    bancoTipoConta: new FormControl(),
    bancoCpfTitular: new FormControl(),
  
    // Propriedade para controle de acesso
    ehUsuario: new FormControl(),
  
    // Data de cadastro
    dataCadastro: new FormControl()
  });

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
