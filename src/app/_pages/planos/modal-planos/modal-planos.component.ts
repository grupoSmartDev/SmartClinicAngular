import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { Plano } from '../../../_module/planoModule';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paciente } from '../../../_module/pacienteModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { PlanoService } from '../../../_services/plano.service';

@Component({
  selector: 'app-modal-planos',
  templateUrl: './modal-planos.component.html',
  styleUrl: './modal-planos.component.css'
})
export class ModalPlanosComponent implements OnInit{
  @Input() data = {} as Plano;
  @Output() dadosAtualizados = new EventEmitter<void>();

  
  constructor(private toast: ToastrService,
    private planoService: PlanoService,
    private fb : FormBuilder
  ) { }

  formulario! : FormGroup;
  valorMensalCalculado : string = '';
  

  criarFormulario(){
    this.formulario = this.fb.group({
      id : [''],
      descricao : [''],
      tempoMinutos : [0],
      diasSemana : [1],
      centroDeCustoId : [''],
      valorBimestral : [0],
      valorTrimestral : [0],
      valorQuadrimestral : [0],
      valorSemestral : [0],
      valorAnual : [0],
      valorMensal : [0],
      data : [''],
      pacienteId : [''],
      financeiroId : [''],
      tipoMes : ['a']

    })
  }

  
  ngOnInit(){
    this.criarFormulario();

   
  }
  
  calculoValorMensal(event:any){
    this.formulario.get('valorMensal')?.valueChanges.subscribe((valorMensal: number) => {
      if (valorMensal) {
        this.valorMensalCalculado = (valorMensal / 12).toString(); // Calcular valor mensal
      } else {
        this.valorMensalCalculado = '0'; // Caso o campo esteja vazio
      }
    });
  }
  



  onSubmit() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      const dadosToSave: Plano = this.formulario.value as Plano;
      if (dadosToSave.id) {
        this.planoService.Atualizar(dadosToSave).subscribe({
          next: (response: ResponseModel<Plano>) => {
            this.toast.success('plano atualizado com Sucesso', 'Parabéns');
            this.dadosAtualizados.emit(); // Emita o evento após a atualização
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar um plano');
          }
        });
      } else {
        this.planoService.Criar(dadosToSave).subscribe({
          next: (response: ResponseModel<Plano>) => {
            this.toast.success('plano Criado com sucesso', 'Parabéns');
            this.dadosAtualizados.emit(); // Emita o evento após a criação
            btnCacelar.click();
            this.fecharModal();
          },
          error: (err) => {
            console.error('Erro ao criar plano:', err);
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar um plano');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  carregarDados(plano: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }
}
