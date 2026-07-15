import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { environment } from '../../../environments/environment';

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
      userKey: [environment.defaultUserKey, Validators.required],
      email: ['', [Validators.required]],
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
      error: error => {
        this.error = error.error || "Ocorreu um erro ao efetuar o login.";
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
