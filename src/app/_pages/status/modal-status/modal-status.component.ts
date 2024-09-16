import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Status } from '../../../_module/statusModule';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrl: './modal-status.component.css'
})
export class ModalStatusComponent {
  
  formulario = new FormGroup({
    id : new FormControl(),
    cor : new FormControl(),
    legenda : new FormControl(),
    status : new FormControl()
  })

  @ViewChild('modalStatus') modalStatus? : ElementRef
  @Input() status = {} as Status;

  onSubmit() {
    console.table(this.formulario.value);
  }

  carregarStatus(status : any){
    this.formulario.patchValue(this.status)
  }

  fecharModal()
  {
    this.formulario.reset()
  }
}
