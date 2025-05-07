import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../_services/config.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.css'
})
export class AlterarSenhaComponent {

  constructor(private toast: ToastrService, private alterarSenhaService: ConfigService, private fb: FormBuilder) {
    fb.group({
      id: [null],
      senha: [null, Validators.required]
    })
  }
}
