import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FinancReceberService } from '../../../_services/financ-receber.service';
import { FinancReceber } from '../../../_module/financReceberModule';
import { ResponseModel } from '../../../_module/ResponseModule';
import { CentroDeCustoService } from '../../../_services/centro-de-custo.service';
import { FormaPagamentoService } from '../../../_services/forma-pagamento.service';
import { PacienteService } from '../../../_services/paciente.service';
import { CentroDeCusto } from '../../../_module/centroDeCustoModule';
import { FormaPagamento } from '../../../_module/formaPagamentoModule';
import { TipoPagamentoService } from '../../../_services/tipo-pagamento.service';
import { TipoPagamento } from '../../../_module/tipoPagamentoModule';

@Component({
  selector: 'app-modal-financ-receber',
  templateUrl: './modal-financ-receber.component.html',
  styleUrls: ['./modal-financ-receber.component.css']
})
export class ModalFinanceiroReceber implements OnInit {
  @ViewChild('modalComponent') modalComponent?: ElementRef;
  @Input() data = {} as FinancReceber;
  @Output() dadosAtualizado = new EventEmitter<void>();

  formulario!: FormGroup;

  listaCliente = [{ id: 1, nome: 'Cliente 1', cpf: '12341' }, { id: 2, nome: 'Cliente 2', cpf: '12341' }];
  listaCentroDeCusto! : CentroDeCusto[];
  listaFormaPagamento! : FormaPagamento[];
  listaTipoPagamento! : TipoPagamento[];

  myControl = new FormControl();
  options: string[] = ['Cliente 1', 'Cliente 2', 'Cliente 3'];
  filteredOptions: string[] = [];
  errorMessage = "";

  constructor(
    private financReceberService: FinancReceberService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private centroCustoService : CentroDeCustoService,
    private formaPagamentoService : FormaPagamentoService,
    private pacienteService : PacienteService,
    private tipoPagamentoService : TipoPagamentoService
  ) {
    this.formulario = this.fb.group({
      id: [],
      idOrigem : [''],
      nrDocto : [''],
      dataEmissao: ['', Validators.required],
      valorOriginal : [''],
      valorPago : [''],
      parcela: [1, [Validators.required, Validators.min(1)]],
      valor: [0, [Validators.required, Validators.min(1)]],
      status : [''],
      notaFiscal : [''],
      descricao: ['', Validators.required],
      classificacao : [''],
      observacao: [''],
      pacienteId: [''],
      fornecedorId : [''],
      centroCustoId: [''],
      bancoId : [''],
      subFinancReceber: this.fb.array([]),
    });

    this.filteredOptions = this.options;
    this.myControl.valueChanges.subscribe(() => {
      this.filterOptions();
    });
  }
  ngOnInit(): void {
    this.buscarCC();
    this.buscarFP();
    this.buscarTP();
  }

  filterOptions(): void {
    const query = this.myControl.value?.toLowerCase() || '';
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }

  selectOption(option: string): void {
    this.formulario.patchValue({ paciente: option });
    this.myControl.setValue(option);
    this.filteredOptions = [];
  }

  carregarDados(financReceber: any) {
    this.formulario.patchValue(this.data);
  }

  fecharModal() {
    this.formulario.reset();
  }

  onSubmit() {
    const btnCancelar = document.querySelector('#btnCancelar') as HTMLElement;
    if (this.formulario.valid) {
      const dadosToSave: FinancReceber = this.formulario.value as FinancReceber;
      if (dadosToSave.id) {
        this.financReceberService.Atualizar(dadosToSave).subscribe({
          next: () => {
            this.toast.success('Conta a receber atualizada com sucesso', 'Parabéns');
            this.dadosAtualizado.emit();
            btnCancelar.click();
            this.fecharModal();
          },
          error: () => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao atualizar');
          }
        });
      } else {
        this.financReceberService.Criar(dadosToSave).subscribe({
          next: () => {
            this.toast.success('Conta a receber criada com sucesso', 'Parabéns');
            this.dadosAtualizado.emit();
            btnCancelar.click();
            this.fecharModal();
          },
          error: () => {
            this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao criar');
          }
        });
      }
    } else {
      console.error('Formulário inválido');
    }
  }

  get subFinancReceber(): FormArray {
    return this.formulario.get('subFinancReceber') as FormArray;
  }

  gerarParcelas(): void {
    const valorTotal = this.formulario.get('valor')?.value || 0;
    const quantidadeParcelas = this.formulario.get('parcela')?.value || 1;

    this.subFinancReceber.clear();

    const valorParcela = parseFloat((valorTotal / quantidadeParcelas).toFixed(2));
    for (let i = 0; i < quantidadeParcelas; i++) {
      const dataVencimento = new Date();
      dataVencimento.setMonth(dataVencimento.getMonth() + i);

      this.subFinancReceber.push(
        this.fb.group({
          id: [null],
          financReceberId: [null],
          parcela: [i + 1],
          valor: [valorParcela, [Validators.required, Validators.min(0)]],
          dataVencimento: [dataVencimento.toISOString().split('T')[0], Validators.required],
          dataPagamento: [''],
          observacao: [''],
          desconto: [0],
          juros: [0],
          multa : [0],
          formaPagamentoId : [''],
          tipoPagamentoId : [''],
        })
      );
    }
  }

  onValorTotalChange(): void {
    if (this.formulario.get('parcelas')?.value > 0) {
      this.gerarParcelas();
    }
  }

  testeEnvios(): void {
    debugger
    if (this.formulario.valid) {
      console.log('Formulário enviado:', this.formulario.value);
      alert('Formulário enviado com sucesso!');
      // Aqui você pode enviar os dados para o backend
    } else {
      alert('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }

  isDropdownOpen = false;

  onInputFocus(): void {
    this.isDropdownOpen = true;
  }

  onInputBlur(): void {
    // Adicione um pequeno atraso para permitir o clique no dropdown antes de fechá-lo
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }

  buscarCC() : void{
    this.centroCustoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaCentroDeCusto = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar Centro de custo:', err);
        this.errorMessage = 'Erro ao carregar os Centro de custo. Tente novamente mais tarde.';
      }
    })
  }

  buscarFP() : void{
    this.formaPagamentoService.Listar().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaFormaPagamento = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar forma de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os forma de pagamento. Tente novamente mais tarde.';
      }
    })
  }
  buscarTP() : void{
    this.tipoPagamentoService.ListarTipoPagamento().subscribe({
      next: (data) => {
        if (data.dados) {
          this.listaTipoPagamento = data.dados;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar tipo de pagamento:', err);
        this.errorMessage = 'Erro ao carregar os tipo de pagamento. Tente novamente mais tarde.';
      }
    })
  }

 

}
