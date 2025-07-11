import { Component, Input, ViewChild } from '@angular/core';
import { Paciente } from '../../../../_module/pacienteModule';
import { PacienteEvolucaoDialogComponent } from '../dialogs/paciente-evolucao-dialog/paciente-evolucao-dialog.component';
import { PacientePlanoDialogComponent } from '../dialogs/paciente-plano-dialog/paciente-plano-dialog.component';
import { PacienteService } from '../../../../_services/paciente.service';
import { PacienteCalculationServiceService } from '../../../../_services/pacienteCompleto/paciente-calculation-service.service';
import { ToastrService } from 'ngx-toastr';
import { DatePtBrPipe } from '../../../../_shared/pipes/date-pt-br.pipe';

@Component({
  selector: 'app-paciente-details',
  templateUrl: './paciente-details.component.html',
  styleUrl: './paciente-details.component.css',
  providers: [DatePtBrPipe]
})
export class PacienteDetailsComponent {
  @Input() paciente: Paciente = {} as Paciente;

  // Referências para os diálogos
  @ViewChild(PacienteEvolucaoDialogComponent) evolutionDialog!: PacienteEvolucaoDialogComponent;
  @ViewChild(PacientePlanoDialogComponent) planDialog!: PacientePlanoDialogComponent;

  // Estado do componente
  isLoading = false;
  isModalOpen = false;

  // Aba ativa
  activeTab: 'info' | 'finance' | 'appointments' | 'plans' = 'info';

  constructor(
    private pacienteService: PacienteService,
    private patientCalculationService: PacienteCalculationServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.validatePatientData();
  }

  // ========== VALIDAÇÃO INICIAL ==========
  private validatePatientData(): void {
    if (!this.paciente || !this.paciente.id) {
      this.toastr.error('Dados do paciente não encontrados', 'Erro');
      return;
    }
  }

  // ========== CONTROLE GERAL DO MODAL ==========
  openModal(): void {
    const modal = document.getElementById('modalPacienteDetalhado') as HTMLDialogElement;
    if (modal) {
      this.isModalOpen = true;
      modal.showModal();
      this.setActiveTab('info'); // Sempre abrir na primeira aba
    }
  }

  closeModal(): void {
    const modal = document.getElementById('modalPacienteDetalhado') as HTMLDialogElement;
    if (modal) {
      modal.close();
      this.isModalOpen = false;
    }
  }

  // ========== CONTROLE DAS ABAS ==========
  setActiveTab(tab: 'info' | 'finance' | 'appointments' | 'plans'): void {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  // ========== CÁLCULOS PARA DISPLAY ==========
  calcularValorTotalReceita(): number {
    return this.patientCalculationService.calcularValorTotalReceita(this.paciente);
  }

  quantidadeAulasFeitas(): number {
    // Note: O método original calculava cancelamentos, vou manter o nome mas corrigir a lógica
    return this.quantidadeAulasCanceladas();
  }

  quantidadeAulasCanceladas(): number {
    return this.patientCalculationService.quantidadeAulasCanceladas(this.paciente);
  }

  quantidadeAgendamentos(): number {
    return this.paciente.agendamentos?.length || 0;
  }

  // ========== GERENCIAMENTO DE EVOLUÇÃO ==========
  openEvolutionDialog(evolucao: any = null): void {
    if (this.evolutionDialog) {
      this.evolutionDialog.openDialog(evolucao);
    }
  }

  onEvolutionSaved(): void {
    this.toastr.success('Evolução salva com sucesso!', 'Sucesso');
    this.refreshPatientData();
  }

  onEvolutionDialogClosed(): void {
    // Ações específicas quando o diálogo de evolução é fechado
  }

  // ========== GERENCIAMENTO DE PLANOS ==========
  openPlanDialog(): void {
    if (this.planDialog) {
      this.planDialog.openDialog(false); // false = não é renovação
    }
  }

  openPlanRenewalDialog(): void {
    const canRenew = this.patientCalculationService.podeRenovarPlano(this.paciente);

    if (!canRenew) {
      this.toastr.warning('O plano atual ainda está vigente', 'Aviso');
      return;
    }

    if (this.planDialog) {
      this.planDialog.openDialog(true); // true = é renovação
    }
  }

  onPlanSaved(): void {
    this.toastr.success('Plano salvo com sucesso!', 'Sucesso');
    this.refreshPatientData();
  }

  onPlanDialogClosed(): void {
    // Ações específicas quando o diálogo de planos é fechado
  }

  // ========== VERIFICAÇÕES DE ESTADO ==========
  hasPlan(): boolean {
    return !!(this.paciente.plano && this.paciente.plano.id);
  }

  canRenewPlan(): boolean {
    return this.patientCalculationService.podeRenovarPlano(this.paciente);
  }

  hasEvolutions(): boolean {
    return !!(this.paciente.evolucoes && this.paciente.evolucoes.length > 0);
  }

  hasAppointments(): boolean {
    return !!(this.paciente.agendamentos && this.paciente.agendamentos.length > 0);
  }

  hasFinancialRecords(): boolean {
    return !!(this.paciente.financReceber && this.paciente.financReceber.length > 0);
  }

  // ========== INFORMAÇÕES DO PLANO ==========
  getPlanTypeDescription(): string {
    if (!this.paciente.plano?.tipoMes) return '';

    const tiposMap: { [key: string]: string } = {
      'm': 'Plano Mensal',
      'b': 'Plano Bimestral',
      't': 'Plano Trimestral',
      'q': 'Plano Quadrimestral',
      's': 'Plano Semestral',
      'a': 'Plano Anual'
    };

    return tiposMap[this.paciente.plano.tipoMes] || '';
  }

  getInsuranceInfo(): string {
    return this.paciente.convenio?.nome || 'Sem convênio';
  }

  getInsurancePhone(): string {
    return this.paciente.convenio?.telefone || '';
  }

  // ========== INFORMAÇÕES DE CONTATO ==========
  getWhatsAppLink(): string {
    if (!this.paciente.celular) return '';
    return `https://wa.me/55${this.paciente.celular}`;
  }

  hasWhatsApp(): boolean {
    return !!(this.paciente.celular && this.paciente.celular.length > 0);
  }

  // ========== ATUALIZAÇÃO DE DADOS ==========
  private refreshPatientData(): void {
    if (!this.paciente.id) return;

    this.isLoading = true;

    this.pacienteService.Listar().subscribe({
      next: (response) => {
        if (response.dados) {
          this.paciente = response.dados.filter((p) => p.id === this.paciente.id)[0];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao atualizar dados do paciente:', error);
        this.isLoading = false;
        this.toastr.error('Erro ao atualizar dados do paciente', 'Erro');
      }
    });
  }

  // ========== FORMATAÇÃO DE DADOS ==========
  formatObservation(): string {
    return this.paciente.breveDiagnostico || 'Sem observação';
  }

  formatPatientName(): string {
    return this.paciente.nome || 'Nome não informado';
  }

  formatPatientEmail(): string {
    return this.paciente.email || 'Email não informado';
  }

  formatPatientPhone(): string {
    return this.paciente.celular || 'Telefone não informado';
  }

  // ========== AÇÕES DO FORMULÁRIO ==========
  onSubmit(): void {
    // Esta função será implementada conforme necessário
    // Por enquanto, apenas fecha o modal
    this.closeModal();
  }

  onCancel(): void {
    this.closeModal();
  }

  // ========== UTILITÁRIOS ==========
  isPatientDataValid(): boolean {
    return !!(this.paciente && this.paciente.id && this.paciente.nome);
  }

  getPatientId(): number | null {
    return this.paciente?.id || null;
  }

  getPatientName(): string {
    return this.paciente?.nome || '';
  }

  // ========== DEBUGGING (remover em produção) ==========
  logPatientData(): void {
    console.log('Dados do paciente:', this.paciente);
  }

  logCurrentTab(): void {
    console.log('Aba ativa:', this.activeTab);
  }

}
