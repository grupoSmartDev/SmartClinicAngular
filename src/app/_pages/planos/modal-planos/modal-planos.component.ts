import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { Plano } from '../../../_module/planoModule';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from '../../../_module/pacienteModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { PlanoService } from '../../../_services/plano.service';

@Component({
  selector: 'app-modal-planos',
  templateUrl: './modal-planos.component.html',
  styleUrl: './modal-planos.component.css'
})
export class ModalPlanosComponent{
  @Input() data = {} as Plano;
  @Output() dadosAtualizados = new EventEmitter<void>();

  
  constructor(private toast: ToastrService,
    private planoService: PlanoService,
    private fb : FormBuilder
  ) { 

    this.formulario = this.fb.group({
      id : [null],
      descricao : [null, Validators.required],
      tempoMinutos : [0],
      diasSemana : [1, Validators.required],
      centroDeCustoId : [null],
      valorBimestral : [0, [Validators.required, Validators.min(0)]],
      valorTrimestral : [0, [Validators.required, Validators.min(0)]],
      valorQuadrimestral : [0, [Validators.required, Validators.min(0)]],
      valorSemestral : [0, [Validators.required, Validators.min(0)]],
      valorAnual : [0, [Validators.required, Validators.min(0)]],
      valorMensal : [0, [Validators.required, Validators.min(0)]],
      data : [null],
      pacienteId : [null],
      financeiroId : [null],
      tipoMes : ['a']
    })
  }

  formulario! : FormGroup;
  valorMensalCalculado : string = '';
  


  
  calculoValorMensal(event:any){
    this.formulario.get('valorMensal')?.valueChanges.subscribe((valorMensal: number) => {
      if (valorMensal) {
        this.valorMensalCalculado = (valorMensal / 12).toString(); // Calcular valor mensal
      } else {
        this.valorMensalCalculado = '0'; // Caso o campo esteja vazio
      }
    });
  }
  

onSubmit(){

  if(this.formulario.invalid){
    this.formulario.markAllAsTouched();
    this.toast.error('Por favor, preencha os campos obrigatórios.', 'Erro');
    return;
  }

  const dataToSave = this.formulario.value as Plano;

  const saveOperation = dataToSave.id
    ? this.planoService.Atualizar(dataToSave)
    : this.planoService.Criar(dataToSave);

    saveOperation.subscribe({
      next: () => {
        const action = dataToSave.id ? 'atualizado' : 'criado';
        this.toast.success(`Plano ${action} com sucesso!`, 'Parabéns');
        this.dadosAtualizados.emit();
        this.fecharModal();

      },
      error: () => {
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
}


  carregarDados(plano: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    const btnCacelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCacelar.click();
  }
}
