import { Component, ViewChild } from '@angular/core';
import { PacienteService } from '../../../_services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { ModalPacienteComponent } from '../modal-paciente/modal-paciente.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { Paciente } from '../../../_module/pacienteModule';
import * as bootstrap from 'bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteCompletoComponent } from '../paciente-completo/paciente-completo.component';
import { TipoMes } from '../../../_module/planoModule';
import { StatusPagamento } from '../../../_module/financReceberModule';
import { NgxSpinnerService } from 'ngx-spinner';
import { FichaAvaliacaoComponent } from '../ficha-avaliacao/ficha-avaliacao.component';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  cacheList: Paciente[];
  totalItems: number;
  timestamp: number;
}

@Component({
  selector: 'app-listar-paciente',
  templateUrl: './listar-paciente.component.html',
  styleUrl: './listar-paciente.component.css',
})
export class ListarPacienteComponent {
  constructor(
    private pacienteService: PacienteService,
    private toast: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private tabService: TabService
  ) {}

  @ViewChild(ModalPacienteComponent)
  modalPacienteComponent!: ModalPacienteComponent;
  @ViewChild(PacienteCompletoComponent)
  modalPacienteCompletoComponent!: PacienteCompletoComponent;
  @ViewChild(FichaAvaliacaoComponent)
  modalFichaAvaliacaoComponent!: FichaAvaliacaoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  lista: Paciente[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: Paciente;
  mostrarFiltros: boolean = true; // Começa expandido por padrão
  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  nomeFiltro: string = '';
  idFiltro: string = '';
  cpfFiltro: string = '';
  celularFiltro: string = '';
  paginar: boolean = true;

  pacienteId: string = ''; // Para armazenar o ID do paciente da rota

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  ngOnInit(): void {
    // Verificar se há um parâmetro ID na rota
    // this.route.params.subscribe(params => {
    //   if (params['id']) {
    //     this.pacienteId = params['id'];
    //     this.idFiltro = this.pacienteId;
    //     // Se houver ID na rota, abrir o modal detalhado diretamente
    //     this.loadPacienteEspefico();
    //   } else {
    //     this.loadData(); // Carrega lista normal de pacientes se não tiver ID
    //   }
    // });
    this.loadData();
  }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `paciente-list-${this.currentPage}-${this.pageSize}-${this.nomeFiltro}-${this.idFiltro}-${this.paginar}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Método para invalidar o cache quando necessário
  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  loadPacienteEspefico(): void {
    //this.spinner.show();

    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;

    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.cacheList;
      this.totalItems = cachedData.totalItems;
    } else {
      this.pacienteService
        .Listar(
          this.currentPage,
          this.pageSize,
          this.nomeFiltro,
          this.idFiltro,
          this.cpfFiltro,
          this.celularFiltro,
          this.paginar
        )
        .subscribe({
          next: (response) => {
            if (response && response.dados) {
              // Abrir o modal detalhado do paciente
              setTimeout(() => {
                this.openModalDetalhado(response.dados[0]);
              }, 1000); // Pequeno atraso para garantir que componentes estejam inicializados
            }

            // Armazena os dados no cache
            this.tabService.setCacheData(cacheKey, {
              cacheList: this.lista,
              totalItems: this.totalItems,
              timestamp: Date.now(),
            });
            // Ainda carrega a lista com o filtro aplicado
            this.loadData();
          },
          error: (err) => {
            console.error('Erro ao buscar paciente específico:', err);
            this.toast.error('Erro ao buscar dados do paciente', 'Erro');
            this.loadData(); // Carrega a lista normal em caso de erro
            //this.spinner.hide();
          },
        });
    }
  }

  loadData(): void {
    this.pacienteService
      .Listar(
        this.currentPage,
        this.pageSize,
        this.nomeFiltro,
        this.idFiltro,
        this.cpfFiltro,
        this.celularFiltro,
        this.paginar
      )
      .subscribe({
        next: (data) => {
          // this.spinner.show();
          if (data.dados) {
            this.lista = data.dados;
            this.totalItems = data.totalCount ?? 0;
            console.log(this.lista);
          }
        },
        error: (err) => {
          console.error('Erro ao buscar Paciente:', err);
          this.errorMessage =
            'Erro ao carregar os Paciente. Tente novamente mais tarde.';
        },
        complete: () => {
          // this.spinner.hide();
        },
      });

    // this.lista = [
    //   {
    //     "id": 1,
    //     "bairro": "Centro",
    //     "breveDiagnostico": "Hipertensão",
    //     "celular": "(11) 98765-4321",
    //     "cep": "01000-000",
    //     "cidade": "São Paulo",
    //     "comoConheceu": "Indicação de amigo",
    //     "complemento": "Apt. 45",
    //     "convenioId": 101,
    //     "cpf": "123.456.789-00",
    //     "dataNascimento": "1985-06-15",
    //     "email": "joao.silva@email.com",
    //     "uf": "SP",
    //     "estadoCivil": "Casado",
    //     "logradouro": "Rua das Flores",
    //     "medicamento": "Losartana",
    //     "profissionalId": 3,
    //     "nome": "João Silva",
    //     "numero": "123",
    //     "pais": "Brasil",
    //     "permitirLembretes": true,
    //     "preferenciaDeContato": "WhatsApp",
    //     "profissao": "Engenheiro",
    //     "responsavel": false,
    //     "rg": "12.345.678-9",
    //     "sexo": "Masculino",
    //     "telefone": "(11) 3232-1234",
    //     "planoId": 201,
    //     "evolucoes": [],
    //     "dataUltimoAtendimento": "2024-11-01",
    //     "financReceber": []
    //   }, {
    //     "id": 2,
    //     "bairro": "Botafogo",
    //     "breveDiagnostico": "",
    //     "celular": "(21) 99876-5432",
    //     "cep": "22250-040",
    //     "cidade": "Rio de Janeiro",
    //     "comoConheceu": "Redes sociais",
    //     "complemento": "Casa 2",
    //     "convenioId": null,
    //     "cpf": "987.654.321-00",
    //     "dataNascimento": "1995-03-20",
    //     "email": "maria.oliveira@email.com",
    //     "uf": "RJ",
    //     "estadoCivil": "Solteira",
    //     "logradouro": "Av. Atlântica",
    //     "medicamento": "Salbutamol",
    //     "profissionalId": 5,
    //     "nome": "Maria Oliveira",
    //     "numero": "456",
    //     "pais": "Brasil",
    //     "permitirLembretes": "Sim",
    //     "preferenciaDeContato": "Email",
    //     "profissao": "Advogada",
    //     "responsavel": "Não",
    //     "rg": "34.567.890-1",
    //     "sexo": "Feminino",
    //     "telefone": "(21) 3232-5678",
    //     "planoId": 1,
    //     "plano" : {
    //       "id" : 1,
    //       "descricao" : "teste",
    //       "ativo" : true,
    //       "diasSemana" : 3,
    //       "dataFim" : new Date(),
    //       "centroCustoId" : undefined,
    //       "dataInicio" : undefined,
    //       "financeiroId" : undefined,
    //       "pacienteId" : 2,
    //       "tempoMinutos" : 230,
    //       "tipoMes" : TipoMes.Mensal
    //     },
    //     "evolucoes": [
    //       {
    //         "id": 1,
    //         "observacao": "Evolução 1",
    //         "pacienteId": 2,
    //         "profissionalId": "1",
    //         "dataEvolucao" : new Date(),
    //         "atividades" : [
    //           {
    //             "descricao" : "Atividade A",
    //             "evolucaoId" : 1,
    //             "id" : 2,
    //             "tempo" : 60,
    //             "titulo" : "teste titulo atividade"
    //           },
    //           {
    //             "descricao" : "Atividade B",
    //             "evolucaoId" : 1,
    //             "id" : 3,
    //             "tempo" : 30,
    //             "titulo" : "teste titulo 2"
    //           }
    //         ],
    //         "exercicios" : [
    //           {
    //             "descricao" : "Exercício A",
    //             "evolucaoId" : 1,
    //             "id" : 4,
    //             "repeticoes" : 10,
    //             "series" : 3,
    //             "tempo" : 30,
    //             "obs" : "Teste titulo exercicio 1"
    //           }
    //         ]
    //       }
    //     ],
    //     "dataUltimoAtendimento": "2024-10-15",
    //     "financReceber": [
    //       {
    //         "id": "1",
    //         "idOrigem": "123",
    //         "nrDocto": "DOC123456",
    //         "dataEmissao": new Date("2025-01-01"),
    //         "valorOriginal": 1500.0,
    //         "valorPago": 500.0,
    //         "parcela": 3,
    //         "valor": 500.0,
    //         "status": StatusPagamento.PENDENTE, // Exemplo de valor para StatusPagamento
    //         "notaFiscal": "NF12345",
    //         "descricao": "Consulta médica",
    //         "classificacao": "Saúde",
    //         "observacao": "Primeira parcela paga",
    //         "pacienteId": "P001",
    //         "paciente": {
    //           "id": 1,
    //           "nome": "João Silva",
    //           "cpf": "123.456.789-00",
    //           "telefone": "99999-9999"
    //         },
    //         "fornecedorId": "F001",
    //         "centroCustoId": "CC001",
    //         "centroCusto": {
    //           "id": "CC001",
    //           "descricao": "Centro de Custo 1",
    //           "tipo": "Receitas Diversas"
    //         },
    //         "bancoId": "B001",
    //         "subFinancReceber": [
    //           {
    //             "id": 1,
    //             "financReceberId": "1",
    //             "parcela": "1/3",
    //             "valor": 500.0,
    //             "dataVencimento": new Date("2025-01-10"),
    //             "dataPagamento": new Date("2025-01-05"),
    //             "observacao": "Pagamento adiantado",
    //             "desconto": 50.0,
    //             "juros": 0.0,
    //             "multa": 0.0,
    //             "formaPagamentoId": "FP001",
    //             "formaPagamento": {
    //               "id": "FP001",
    //               "descricao": "Cartão de Crédito",
    //               "parcelas": 1
    //             },
    //             "tipoPagamentoId": "TP001",
    //             "tipoPagamento": {
    //               "id": "TP001",
    //               "descricao": "Entrada"
    //             }
    //           },
    //           {
    //             "id": 2,
    //             "financReceberId": "1",
    //             "parcela": "2/3",
    //             "valor": 500.0,
    //             "dataVencimento": new Date("2025-02-10"),
    //             "dataPagamento": new Date("2005-02-10"),
    //             "observacao": "Pendente",
    //             "desconto": 0.0,
    //             "juros": 0.0,
    //             "multa": 0.0,
    //             "formaPagamentoId": "FP002",
    //             "formaPagamento": {
    //               "id": "FP002",
    //               "descricao": "Boleto",
    //               "parcelas": 1
    //             },
    //             "tipoPagamentoId": "TP002",
    //             "tipoPagamento": {
    //               "id": "TP002",
    //               "descricao": "Normal"
    //             }
    //           }
    //         ],
    //         "usuarioResponsavelId": "U001",
    //         "dataUltimaAtualizacao": new Date("2025-01-02")
    //       }
    //     ]
    //   }

    //   ];
  }

  openModal(paciente: any) {
    if (paciente.id) {
      this.modalPacienteComponent.paciente = paciente;
      this.modalPacienteComponent.carregarData(paciente);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openModalDetalhado(paciente: any) {
    if (paciente) {
      this.modalPacienteCompletoComponent.Paciente = paciente;
      console.table(paciente);
    }

    const modalElement = document.getElementById('modalPacienteDetalhado');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openfichaAvaliacao(paciente: any) {
    if (paciente.id) {
      this.modalFichaAvaliacaoComponent.getFac(paciente.id);
      this.modalFichaAvaliacaoComponent.paciente = paciente;

      const modalElement = document.getElementById('modalFichaAvaliacao');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  Exluir(paciente: Paciente) {
    let id = paciente.id;
    this.pacienteService.Deletar(id.toString()).subscribe({
      next: (response) => {
        console.log('Paciente excluído com sucesso:', response);
        this.lista = this.lista.filter((paciente) => paciente.id !== id);
        this.toast.success('Paciente  excluído com sucesso!', 'Excluído');
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir Paciente :', err);
        this.toast.error(
          'Tente novamente ou fale com o suporte',
          'Erro ao excluir um Paciente'
        );
      },
    });
  }

  pacienteCompleto(paciente: Paciente): void {
    // Verifica se o paciente possui um id antes de navegar
    if (paciente && paciente.id) {
      this.router.navigate(['/paciente', paciente.id]);
    } else {
      console.error('Paciente inválido ou sem ID.');
    }
  }

  atualizarLista(): void {
    this.loadData(); // Chama o método para buscar os cc novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Exluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Bootstrap usa paginação iniciando em 1
    this.loadData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadData();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.nomeFiltro = '';
    this.idFiltro = '';
    this.cpfFiltro = '';
    this.celularFiltro = '';
    // Opcional: realizar uma busca após limpar
    this.onSearch();
  }
}
