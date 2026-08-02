import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProfissionalService } from '../../../_services/profissional.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Profissional } from '../../../_module/profissionalModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../_services/usuario.service';
import { Profissao } from '../../../_module/profissaoModule';
import { ProfissaoService } from '../../../_services/profissao.service';
import { ConselhoService } from '../../../_services/conselho.service';
import { Conselho } from '../../../_module/conselhoModule';
import { TipoComissao } from '../../../_services/comissao-service.service';

@Component({
  selector: 'app-modal-profissional',
  templateUrl: './modal-profissional.component.html',
  styleUrls: ['./modal-profissional.component.css']
})
export class ModalProfissionalComponent {
  constructor(
    private profissionalService: ProfissionalService,
    private toast: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private profissaoService: ProfissaoService,
    private conselhoService: ConselhoService
  ) {
    this.formulario = this.fb.group({
      id: [null],
      email: [null, [Validators.required, Validators.email]],
      nome: [null, Validators.required],
      sobrenome: [null, Validators.required],
      cpf: [null, Validators.required],
      celular: [null, Validators.required],
      sexo: [null],
      conselhoId: [null],
      registroConselho: [null,],
      ufConselho: [null],
      profissaoId: [null, Validators.required],
      cbo: [null],
      rqe: [null],
      cnes: [null],

      // Propriedades para pagamento
      tipoPagamento: [null],
      chavePix: [null],
      bancoNome: [''],
      bancoAgencia: [null],
      bancoConta: [null],
      bancoTipoConta: [null],
      bancoCpfTitular: [null],

      // Propriedade para controle de acesso
      ehUsuario: [false], // padrão desmarcado

      // Data de cadastro
      dataCadastro: [null],
      tipoComissao: [null],
      // Comissão é opcional - profissionais sem comissão configurada não devem
      // ser bloqueados no submit nem enviar valor inválido ao backend.
      valorComissao: [0],
    })
  }

  @ViewChild('modalEditar') modalSubCentroDeCusto?: ElementRef;
  @Input() profissional = {} as Profissional;
  @Output() dataAtualizado = new EventEmitter<void>();
  exibirCamposUsuario = false;
  isLoading = false;

  lista: Profissional[] = [];
  listaProfissao: Profissao[] = [];
  formulario: FormGroup;
  listaConselho: Conselho[] = [];



  ngOnInit() {
    this.carregarCC();
    this.getProfissao();
    this.getConselho();
  }

  onSubmit() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.toast.error('Preencha todos os campos obrigatórios', 'Formulário Inválido');
      return;
    }

    this.isLoading = true;
    const dataToSave = this.formulario.value as Profissional;
    dataToSave.valorComissao = this.normalizarValorComissao(dataToSave.valorComissao);

    const saveOperation = dataToSave.id ? this.profissionalService.Atualizar(dataToSave) : this.profissionalService.Criar(dataToSave);

    saveOperation.subscribe({
      next: (response) => {
        let mensagem = response.mensagem;
        const action = dataToSave.id ? 'atualizado' : 'criado';

        if (response.status) {
          this.toast.success(`Profissional ${action} com sucesso!`, 'Parabéns');

        }
        else {
          this.toast.error(mensagem, 'Erro');
        }
        this.isLoading = false;
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      },
    });
  }


  // O ngx-currency só reformata o valor quando o usuário interage com o campo;
  // se a comissão nunca for preenchida, o valor inicial pode chegar aqui como
  // string ("0,00") e quebrar a deserialização do decimal no backend.
  private normalizarValorComissao(valor: unknown): number {
    if (valor === null || valor === undefined || valor === '') return 0;
    if (typeof valor === 'number') return valor;
    const numero = parseFloat(String(valor).replace(/\./g, '').replace(',', '.'));
    return isNaN(numero) ? 0 : numero;
  }

  criarUsuarioParaProfissional(profissional: Profissional): void {
    // Login será o email e senha serão os 6 primeiros dígitos do CPF
    const senhaPadrao = profissional.cpf?.slice(0, 6);

    if (!profissional.email || !senhaPadrao) {
      this.toast.error('Dados de login incompletos. Verifique o email e CPF.', 'Erro ao criar usuário');
      return;
    }

    const novoUsuario = {
      email: profissional.email,
      senha: senhaPadrao,
      nome: profissional.nome,
      ativo: true,
    };

    this.usuarioService.Criar(novoUsuario).subscribe({
      next: () => {
        this.toast.success('Usuário criado com sucesso!', 'Login Disponível');
      },
      error: (err) => {
        console.error('Erro ao criar usuário:', err);
        this.toast.error('Erro ao criar usuário. Tente novamente.', 'Erro');
      }
    });
  }

  carregarData(centroDeCusto: any) {
    this.formulario.patchValue(this.profissional);
  }

  fecharModal() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    this.formulario.reset();
    btnCancelar.click();
  }

  carregarCC(): void {
    this.profissionalService.Listar(undefined, undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.lista = data.dados;
        }
      },
    });
  }

  campoParaUsuario() {
    const usuario = this.formulario.get('ehUsuario')?.value == 'true' ? true : false;
    this.exibirCamposUsuario = usuario;
  }

  getProfissao() {
    this.profissaoService.Listar(undefined, undefined, undefined).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaProfissao = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Profissional:', err)
      },
    })
  }

  getConselho() {
    this.conselhoService.Listar(undefined, undefined, undefined, undefined, undefined, false).subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaConselho = data.dados;
        }
      },
      error(err) {
        console.error('Erro ao buscar Conselho:', err)
      },
    })
  }
}