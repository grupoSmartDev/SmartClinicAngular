import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  private returnUrl = '/';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userKey: [environment.defaultUserKey, Validators.required],
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.returnUrl =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';

    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  get f() {
    return this.loginForm.controls as any;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.f.email.value.trim().toLowerCase();
    const password = this.f.password.value;
    const userKey = this.f.userKey.value.trim();

    this.loading = true;
    this.authService.login(email, password, userKey).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        this.error = response.error || 'Nao foi possivel efetuar o login.';
        this.loading = false;
      },
      error: (error) => {
        this.error =
          error?.error?.error ||
          error?.error ||
          'Ocorreu um erro ao efetuar o login.';
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
