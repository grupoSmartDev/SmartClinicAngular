import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
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

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly empresaService: ConfigService,
    private readonly toastr: ToastrService,
    private cepService: BuscarCepService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.carregar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      sobrenome: [''],
      cnpjEmpresaMatriz: [''],
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
    });
  }

  private carregar(): void {
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
      });
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
    });
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
    };

    return dto;
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
          var toast = this.toastr.success('Configurações salvas com sucesso.', 'Sucesso', { timeOut: 1200 });
          toast.onHidden.pipe(take(1)).subscribe(() => window.location.reload());
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
            // Atualiza os campos do formulário automaticamente
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
