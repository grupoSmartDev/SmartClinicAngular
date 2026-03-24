import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ConfigService } from '../../_services/config.service';
import { Configuracoes } from './../../_module/configuracoesModule';
import { BuscarCepService } from '../../_services/buscar-cep.service';
import { AuthService } from '../../_services/auth.service';
import {
  AdminUser,
  UserAdminService,
} from '../../_services/user-admin.service';
import { NgxSpinnerService } from 'ngx-spinner';

// Validators simples (nível júnior)
function onlyDigits(value: string | null | undefined): string {
  return (value || '').replace(/\D/g, '');
}

function cnpjValidator(control: AbstractControl): ValidationErrors | null {
  const raw = control.value as string | null | undefined;
  if (!raw) return null; // required trata vazio
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14) return { cnpjInvalido: true };

  const invalids = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ];
  if (invalids.includes(cnpj)) return { cnpjInvalido: true };

  const calcDV = (base: string, pesos: number[]) => {
    const soma = base
      .split('')
      .map((n, i) => parseInt(n, 10) * pesos[i])
      .reduce((a, b) => a + b, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base12 = cnpj.substring(0, 12);
  const dv1 = calcDV(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = calcDV(base12 + dv1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const ok = cnpj.endsWith(`${dv1}${dv2}`);
  return ok ? null : { cnpjInvalido: true };
}

function cepValidator(control: AbstractControl): ValidationErrors | null {
  const raw = control.value as string | null | undefined;
  if (!raw) return null; // opcional
  const cep = onlyDigits(raw);
  return /^\d{8}$/.test(cep) ? null : { cepInvalido: true };
}

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracoesComponent implements OnInit, OnDestroy {
  formulario!: FormGroup;
  carregando = false;
  salvando = false;
  // TODO: obter esse id da rota/estado quando disponível
  empresaId = 1;
  isAdmin = false;

  usuarios: AdminUser[] = [];
  usuariosTotal = 0;
  usuariosPage = 1;
  usuariosPageSize = 10;
  usuariosFiltro = '';
  usuariosCarregando = false;
  usuariosErro = '';
  usuarioSelecionado: AdminUser | null = null;
  usuarioFoto: File | null = null;
  formUsuario: FormGroup | null = null;
  salvandoUsuario = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly empresaService: ConfigService,
    private readonly toastr: ToastrService,
    private cepService: BuscarCepService,
    private readonly authService: AuthService,
    private readonly userAdminService: UserAdminService,
    private readonly cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.buildForm();
    this.carregar();
    this.isAdmin = this.authService.hasRole('Admin');
    if (this.isAdmin) {
      this.buildUsuarioForm();
      this.carregarUsuarios();
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      sobrenome: [''],
      cnpjEmpresaMatriz: ['', [cnpjValidator]],
      inscricaoEstadual: ['', [Validators.maxLength(14)]],
      inscricaoMunicipal: [''],
      endereco: [''],
      cep: ['', [cepValidator]],
      cidade: [''],
      estado: ['', [Validators.maxLength(2)]],
      telefoneFixo: [''],
      email: ['', [Validators.email]],
      siteOuRedeSocial: [''],
      celular: [''],
      celularComWhatsApp: [false],
      modeloProntuario: [this.getModeloProntuarioLocal() || 'completo'],
    });
  }

  private buildUsuarioForm(): void {
    this.formUsuario = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      role: ['User', [Validators.required]],
    });
  }

  private carregar(): void {

    this.spinner.show();
    this.carregando = true;
    this.empresaService
      .BuscarPorId(this.empresaId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.carregando = false))
      )
      .subscribe({
        next: (api) => this.patchFromApi(api.dados),
        error: (err: any) => {
          console.error('Erro ao carregar empresa', err);
          this.toastr.error('Não foi possível carregar os dados.', 'Erro');
        },
        complete: () => this.spinner.hide(),
      });
  }

  carregarUsuarios(): void {
    if (!this.isAdmin) return;

    this.usuariosCarregando = true;
    this.usuariosErro = '';
    this.userAdminService
      .listar(this.usuariosPage, this.usuariosPageSize, this.usuariosFiltro)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.usuariosCarregando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res: any) => {
          const { items, total } = this.mapUsuariosResponse(res);
          this.usuarios = items;
          this.usuariosTotal = total;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error('Erro ao carregar usuarios', err);
          this.usuariosErro = 'Nao foi possivel carregar os usuarios.';
          this.toastr.error('Nao foi possivel carregar os usuarios.', 'Erro');
          this.cdr.markForCheck();
        },
      });
  }

  private mapUsuariosResponse(res: any): { items: AdminUser[]; total: number } {
    if (!res) return { items: [], total: 0 };

    const root = res.data ?? res.dados ?? res.result ?? res;
    const payload = root?.data ?? root;
    const itemsSource =
      payload?.items ??
      payload?.usuarios ??
      payload?.users ??
      payload;

    const items = Array.isArray(itemsSource)
      ? (itemsSource as AdminUser[])
      : [];

    const totalRaw =
      payload?.totalCount ??
      res?.totalCount ??
      payload?.total ??
      (Array.isArray(items) ? items.length : 0);

    const total =
      typeof totalRaw === 'number' ? totalRaw : Array.isArray(items) ? items.length : 0;

    return { items, total };
  }

  private patchFromApi(api: Configuracoes): void {
    this.formulario.patchValue({
      nome: api.nome,
      sobrenome: api.sobrenome,
      cnpjEmpresaMatriz: api.cnpjEmpresaMatriz,
      inscricaoEstadual: api.inscricaoEstadual,
      inscricaoMunicipal: api.inscricaoMunicipal,
      endereco: api.endereco,
      cep: api.cep,
      cidade: api.cidade,
      estado: api.estado,
      telefoneFixo: api.telefoneFixo,
      celular: api.celular,
      email: api.email,
      siteOuRedeSocial: api.siteOuRedeSocial,
      celularComWhatsApp: api.celularComWhatsApp,
      modeloProntuario:
        api.modeloProntuario || this.getModeloProntuarioLocal() || 'completo',
    });

    this.formulario
      .get('modeloProntuario')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((v) => this.setModeloProntuarioLocal(v));

    this.setEmpresaBrandLocal(api);
  }

  private toApi(): Configuracoes {
    const v = this.formulario.value as Configuracoes;

    const dto: Configuracoes = {
      id: this.empresaId,
      nome: v.nome,
      sobrenome: v.sobrenome,
      inscricaoEstadual: v.inscricaoEstadual,
      inscricaoMunicipal: v.inscricaoMunicipal,
      endereco: v.endereco,
      cep: v.cep,
      cidade: v.cidade,
      estado: v.estado,
      telefoneFixo: v.telefoneFixo,
      email: v.email,
      siteOuRedeSocial: v.siteOuRedeSocial,
      cnpjEmpresaMatriz: v.cnpjEmpresaMatriz,
      celular: v.celular,
      celularComWhatsApp: v.celularComWhatsApp,
      modeloProntuario: v.modeloProntuario,
    };

    return dto;
  }

  private getModeloProntuarioLocal():
    | 'completo'
    | 'resumido'
    | 'anamnese'
    | null {
    try {
      const v = localStorage.getItem('modeloProntuario');
      if (v == 'completo' || v == 'resumido' || v == 'anamnese') return v;
      return null;
    } catch {
      return null;
    }
  }

  private setModeloProntuarioLocal(v: any): void {
    try {
      if (v) localStorage.setItem('modeloProntuario', String(v));
    } catch { }
  }

  private setEmpresaBrandLocal(api: Configuracoes): void {
    try {
      if (!api) return;
      const nome = api.nome || api.sobrenome || '';
      const endereco = api.endereco || '';
      const cidadeUf = [api.cidade, api.estado].filter(Boolean).join(' - ');
      const telefone = api.telefoneFixo || api.celular || '';
      const email = api.email || '';
      const cnpj = api.cnpjEmpresaMatriz || '';

      localStorage.setItem('empresa.nome', nome);
      localStorage.setItem('empresa.cnpj', cnpj);
      localStorage.setItem('empresa.endereco', endereco);
      localStorage.setItem('empresa.cidadeUf', cidadeUf);
      localStorage.setItem('empresa.telefone', telefone);
      localStorage.setItem('empresa.email', email);
    } catch { }
  }

  get ultimaPaginaUsuarios(): number {
    if (!this.usuariosTotal || !this.usuariosPageSize) return 1;
    return Math.max(1, Math.ceil(this.usuariosTotal / this.usuariosPageSize));
  }

  aplicarFiltroUsuarios(): void {
    this.usuariosPage = 1;
    this.carregarUsuarios();
  }

  limparFiltroUsuarios(): void {
    this.usuariosFiltro = '';
    this.aplicarFiltroUsuarios();
  }

  mudarPagina(delta: number): void {
    const alvo = this.usuariosPage + delta;
    const ultima = this.ultimaPaginaUsuarios;
    if (alvo < 1 || alvo > ultima) return;
    this.usuariosPage = alvo;
    this.carregarUsuarios();
  }

  abrirUsuario(usuario: AdminUser): void {
    if (!this.formUsuario) this.buildUsuarioForm();
    const formUsuario = this.formUsuario;
    if (!formUsuario) return;
    this.usuarioSelecionado = usuario;
    this.usuarioFoto = null;
    formUsuario.reset({
      id: usuario.id,
      firstName: usuario.firstName || '',
      lastName: usuario.lastName || '',
      email: usuario.email || '',
      phoneNumber: usuario.phoneNumber || '',
      role: usuario.role || 'User',
    });
    this.cdr.markForCheck();
  }

  onUserPictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.usuarioFoto = input?.files?.[0] ?? null;
  }

  salvarUsuarioEdicao(): void {
    if (!this.usuarioSelecionado || !this.formUsuario) return;

    const formUsuario = this.formUsuario;

    if (formUsuario.invalid) {
      formUsuario.markAllAsTouched();
      return;
    }

    const formValue = formUsuario.value;
    const payload: Partial<AdminUser> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      role: formValue.role,
    };

    this.salvandoUsuario = true;
    this.userAdminService
      .atualizar(this.usuarioSelecionado.id, payload, this.usuarioFoto)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.salvandoUsuario = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.toastr.success('Usuario atualizado.');
          this.fecharModalUsuario();
          this.carregarUsuarios();
        },
        error: (err: any) => {
          console.error('Erro ao atualizar usuario', err);
          this.toastr.error('Erro ao atualizar usuario.', 'Erro');
        },
      });
  }

  private fecharModalUsuario(): void {
    const closeBtn = document.getElementById(
      'btn-close-usuario-modal'
    ) as HTMLButtonElement | null;
    closeBtn?.click();
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const body = this.toApi();
    this.salvando = true;
    this.empresaService
      .Editar(body)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.salvando = false))
      )
      .subscribe({
        next: () => {
          this.salvando = false;
          var toast = this.toastr.success(
            'Configurações salvas com sucesso.',
            'Sucesso',
            { timeOut: 1200 }
          );
          toast.onHidden
            .pipe(take(1))
            .subscribe(() => window.location.reload());
        },
        error: (err: any) => {
          console.error('Erro ao salvar empresa', err);
          this.salvando = false;
          this.toastr.error(
            'Não foi possível salvar as configurações.',
            'Erro'
          );
        },
      });
  }

  buscarCEP() {
    const cep = this.formulario.get('cep')?.value;

    if (cep) {
      this.cepService.buscarCEP(cep).subscribe(
        (data) => {
          if (!data.erro) {
            this.formulario.patchValue({
              endereco: data.logradouro + ' - ' + data.bairro,
              cidade: data.localidade,
              estado: data.uf,
            });
          } else {
            alert('CEP não encontrado.');
          }
        },
        (error) => {
          console.error('Erro ao buscar CEP:', error);
          alert('Ocorreu um erro ao buscar o CEP.');
        }
      );
    }
  }
}
