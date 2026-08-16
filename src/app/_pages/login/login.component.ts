import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userKey: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls as any }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(
      this.f.email.value,
      this.f.password.value,
      this.f.userKey.value
    ).subscribe({
      next: (response) => {
        let resposta = response.error;
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.error = resposta;
          this.loading = false;
        }
      },
      error: err => {
        if (err.error?.mensagem) {
          this.error = err.error.mensagem;
        } else if (err.status === 0) {
          this.error = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else if (err.status === 401) {
          this.error = 'E-mail ou senha inválidos.';
        } else {
          this.error = 'Erro ao realizar login. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
