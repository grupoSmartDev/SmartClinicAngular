import { Component, ViewChild } from '@angular/core';
import { Profissao } from '../../../_module/profissaoModule';
import { ModalProfissaoComponent } from '../modal-profissao/modal-profissao.component';
import { ConfirmDialogComponent } from '../../../_components/confirm-dialog/confirm-dialog.component';
import { ProfissaoService } from '../../../_services/profissao.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { TabService } from '../../../_services/tabs.service';

interface CacheData {
  ListCache: Profissao[];
  totalItems: number;
  timestamp: number;
}
@Component({
  selector: 'app-listar-profissao',
  templateUrl: './listar-profissao.component.html',
  styleUrl: './listar-profissao.component.css'
})
export class ListarProfissaoComponent {
  @ViewChild(ModalProfissaoComponent) modalSalaComponent!: ModalProfissaoComponent;
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  lista: Profissao[] = [];
  errorMessage: string = '';
  idParaExcluir!: string;
  dataParaExcluir!: Profissao;
  mostrarFiltros: boolean = false; // Começa expandido por padrão

  //paginacao
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  // filtros
  descricaoFiltro: string = '';
  profissaoFiltro: string = '';
  id: string = '';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

  private inputListeners: Map<HTMLInputElement, (event: KeyboardEvent) => void> = new Map();

  constructor(private profissaoService: ProfissaoService, private toast: ToastrService, private tabService: TabService,) { }

  private getCacheKey(): string {
    // Cria uma chave única para o cache baseada nos parâmetros atuais
    return `profissao-list-${this.currentPage}-${this.pageSize}-${this.descricaoFiltro}-${this.profissaoFiltro}-${this.id}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private invalidateCache(): void {
    const cacheKey = this.getCacheKey();
    this.tabService.setCacheData(cacheKey, null);
  }

  ngOnInit(): void {
    this.loadData();



    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
      // Cria uma função de listener para cada input
      const listener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.filtrar(); // Passa o input para a função filtrar
        }
      };
      input.addEventListener('keydown', listener);
      this.inputListeners.set(input, listener); // Armazena para remover depois
    });
  }

  ngOnDestroy(): void {
    // Remove os listeners de todos os inputs
    this.inputListeners.forEach((listener, input) => {
      input.removeEventListener('keydown', listener);
    });
    this.inputListeners.clear();
  }

  loadData(): void {
    const cacheKey = this.getCacheKey();
    const cachedData = this.tabService.getCacheData(cacheKey) as CacheData;
    if (cachedData && this.isCacheValid(cachedData.timestamp)) {
      // Se temos dados em cache válidos, use-os
      this.lista = cachedData.ListCache;
      this.totalItems = cachedData.totalItems;
    } else {
      this.profissaoService.Listar(undefined, undefined, this.descricaoFiltro).subscribe({
        next: (data) => {
          if (data.dados) {
            this.lista = data.dados;
            this.totalItems = data.totalCount;

            this.tabService.setCacheData(cacheKey, {
              ListCache: this.lista,
              totalItems: this.totalItems,
              timestamp: Date.now()
            });
          }
        },
        error: (err) => {
          console.error('Erro ao buscar Profissão:', err);
          this.errorMessage = 'Erro ao carregar a Profissão. Tente novamente mais tarde.';
        }
      });
    }

  }

  openModal(profissao: any) {
    if (profissao.id) {
      this.modalSalaComponent.data = profissao;
      this.modalSalaComponent.carregarProfissao(profissao);
    }
    const modalElement = document.getElementById('modalEditarCriar');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Excluir(profissao: Profissao) {

    let id = profissao.id;
    this.profissaoService.Deletar(id.toString()).subscribe({
      next: (response) => {
        const mensagem = response.mensagem;
        const status = response.status;

        if (status) {
          this.lista = this.lista.filter(profissao => profissao.id !== id);
          this.toast.success(`${mensagem}`, 'Excluído');
        }
        else {
          this.toast.error(`${mensagem}`, 'Erro');
        }
        this.invalidateCache();
      },
      error: (err) => {
        console.error('Erro ao excluir Profissão:', err);
        this.toast.error('Tente novamente ou fale com o suporte', 'Erro ao excluir uma profissão');
      }
    });
  }

  atualizarLista(): void {
    this.invalidateCache();
    this.loadData(); // Chama o método para buscar os status novamente
  }

  promptDelete(dataParaExcluir: any) {
    this.dataParaExcluir = dataParaExcluir;
    this.confirmDialog.openDialog();
  }

  confirmDelete() {
    this.Excluir(this.dataParaExcluir);
  }

  cancelDelete() {
    this.idParaExcluir = '';
  }

  onPageChange(page: number): void {
    this.invalidateCache();
    this.currentPage = page;
    this.loadData();
  }

  filtrar(): void {
    this.invalidateCache();
    this.currentPage = 1;
    this.loadData();
  }



  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limparFiltros() {
    this.invalidateCache();
    this.descricaoFiltro = '';
    this.profissaoFiltro = '';
    this.id = '';
    // Opcional: realizar uma busca após limpar
    this.filtrar();
  }

  exportarExcel(): void {
    if (this.lista.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Criar uma tabela HTML
    let tableHtml = '<table border="1">';

    // Adicionar cabeçalho
    tableHtml += '<tr><th>Código</th><th>Nome</th></tr>';

    // Adicionar dados
    this.lista.forEach(item => {
      tableHtml += `<tr><td>${item.id}</td><td>${item.descricao}</td></tr>`;
    });

    // Fechar a tabela
    tableHtml += '</table>';

    // Configurar para download
    const blob = new Blob(['\ufeff', tableHtml], {
      type: 'application/vnd.ms-excel;charset=utf-8'
    });

    // Criar link de download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'profissoes.xls';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Método para exportar para PDF usando impressão do navegador
  exportarPDF(): void {
    if (this.lista.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Criar uma nova janela para o PDF
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      // Estilo para a página de impressão
      let html = `
      <html>
        <head>
          <title>Relatório de Profissões</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
            .data { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; padding: 8px; text-align: left; border: 1px solid #ddd; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Profissões</h1>
          <div class="data">Data de Exportação: ${new Date().toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
    `;

      // Adicionar linhas da tabela
      this.lista.forEach(item => {
        html += `
        <tr>
          <td>${item.id}</td>
          <td>${item.descricao}</td>
        </tr>
      `;
      });

      // Fechar a tabela e a estrutura HTML
      html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

      // Escrever o HTML na nova janela
      printWindow.document.write(html);
      printWindow.document.close();

      // Esperar pelo carregamento da página
      printWindow.onload = function () {
        // Usar a função de impressão do navegador que permite salvar como PDF
        printWindow.print();
      };
    } else {
      alert('Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão bloqueados.');
    }
  }

  handleEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.filtrar();
    }
  }

}
