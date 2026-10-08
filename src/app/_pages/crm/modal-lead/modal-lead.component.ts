import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

import { LeadService } from '../../../_services/crm/lead.service';
import { FollowUpService } from '../../../_services/crm/follow-up.service';
import { EtapaFunilService } from '../../../_services/crm/etapa-funil.service';
import { CampanhaService } from '../../../_services/crm/campanha.service';
import { ProfissionalService } from '../../../_services/profissional.service';
import { TabService } from '../../../_services/tabs.service';
import { DateHelper } from '../../../_shared/helpers/date-helper';
import {
  CANAIS_FOLLOWUP,
  CANAIS_ORIGEM,
  Campanha,
  ETAPA_GANHO_ID,
  ETAPA_NOVO_LEAD_ID,
  ETAPA_PERDIDO_ID,
  EtapaFunil,
  FollowUp,
  FollowUpCreateDto,
  FollowUpEdicaoDto,
  Lead,
  LeadCreateDto,
  LeadEdicaoDto,
  MOTIVOS_PERDA
} from '../../../_module/crmModule';
import { CrmHelpers } from '../crm-helpers';

@Component({
  selector: 'app-modal-lead',
  templateUrl: './modal-lead.component.html',
  styleUrl: './modal-lead.component.css'
})
export class ModalLeadComponent implements OnInit {
  constructor(
    private leadService: LeadService,
    private followUpService: FollowUpService,
    private etapaFunilService: EtapaFunilService,
    private campanhaService: CampanhaService,
    private profissionalService: ProfissionalService,
    private tabService: TabService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({
      id: [null],
      nome: [''],
      telefone: [''],
      email: [''],
      canalOrigem: [null],
      campanhaId: [null],
      profissionalId: [null],
      etapaFunilId: [ETAPA_NOVO_LEAD_ID],
      observacao: [''],
      motivoPerdaId: [null]
    });

    this.formFollowUp = this.fb.group({
      canal: ['WhatsApp'],
      mensagemEnviada: [''],
      respostaRecebida: [''],
      proximaAcaoData: [null],
      proximaAcaoDescricao: ['']
    });

    // Edição inline de um follow-up existente (só desfecho e próxima ação)
    this.formEdicaoFollowUp = this.fb.group({
      respostaRecebida: [''],
      proximaAcaoData: [null],
      proximaAcaoDescricao: ['']
    });

    // Conclusão de um follow-up + registro opcional da próxima ação (vira um novo follow-up)
    this.formProximaAcao = this.fb.group({
      proximaAcaoData: [null],
      proximaAcaoDescricao: [''],
      canal: ['WhatsApp']
    });
  }

  // Emitido sempre que algo do lead muda (criar/editar/mover/excluir/converter/follow-up)
  @Output() dataAtualizado = new EventEmitter<void>();

  private readonly MODAL_ID = 'modalLead';

  readonly canaisOrigem = CANAIS_ORIGEM;
  readonly canaisFollowUp = CANAIS_FOLLOWUP;
  readonly motivosPerda = MOTIVOS_PERDA;
  readonly ETAPA_PERDIDO_ID = ETAPA_PERDIDO_ID;
  readonly helpers = CrmHelpers;

  formulario: FormGroup;
  formFollowUp: FormGroup;
  formEdicaoFollowUp: FormGroup;
  formProximaAcao: FormGroup;

  abaAtiva: 'dados' | 'followups' = 'dados';
  lead: Lead | null = null;          // lead carregado do backend (null = novo)
  followUps: FollowUp[] = [];

  listaEtapas: EtapaFunil[] = [];
  listaCampanhas: Campanha[] = [];
  listaProfissionais: { id: number; nome: string; sobrenome?: string }[] = [];

  isLoading = false;
  isLoadingFollowUp = false;
  isMovendo = false;
  isConvertendo = false;
  mostrarFormFollowUp = false;
  confirmandoExclusao = false;
  followUpParaExcluir: number | null = null;
  followUpExpandidoId: number | null = null;
  isSalvandoEdicaoFollowUp = false;
  followUpConcluindoId: number | null = null;
  isConcluindoFollowUp = false;

  ngOnInit(): void {
    this.getProfissionais();
  }

  // ===================== Abertura / fechamento =====================

  abrirNovo(etapaFunilId?: number): void {
    this.resetarEstado();
    this.formulario.patchValue({ etapaFunilId: etapaFunilId || ETAPA_NOVO_LEAD_ID });
    this.carregarListas();
    this.mostrarModal();
  }

  abrirLead(leadId: number, opcoes?: { aba?: 'dados' | 'followups'; etapaDestinoId?: number }): void {
    this.resetarEstado();
    this.carregarListas();
    this.carregarLead(leadId, opcoes?.etapaDestinoId);
    if (opcoes?.aba) this.abaAtiva = opcoes.aba;
    this.mostrarModal();
  }

  private mostrarModal(): void {
    const el = document.getElementById(this.MODAL_ID);
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
  }

  fecharModal(): void {
    const el = document.getElementById(this.MODAL_ID);
    if (el) bootstrap.Modal.getInstance(el)?.hide();
    this.resetarEstado();
  }

  private resetarEstado(): void {
    this.lead = null;
    this.followUps = [];
    this.abaAtiva = 'dados';
    this.mostrarFormFollowUp = false;
    this.confirmandoExclusao = false;
    this.followUpParaExcluir = null;
    this.followUpExpandidoId = null;
    this.followUpConcluindoId = null;
    this.isLoading = false;
    this.formulario.reset({
      id: null,
      nome: '',
      telefone: '',
      email: '',
      canalOrigem: null,
      campanhaId: null,
      profissionalId: null,
      etapaFunilId: ETAPA_NOVO_LEAD_ID,
      observacao: '',
      motivoPerdaId: null
    });
    this.resetarFormFollowUp();
  }

  private resetarFormFollowUp(): void {
    this.formFollowUp.reset({
      canal: 'WhatsApp',
      mensagemEnviada: '',
      respostaRecebida: '',
      proximaAcaoData: null,
      proximaAcaoDescricao: ''
    });
  }

  // ===================== Carregamentos =====================

  private carregarLead(leadId: number, etapaDestinoId?: number): void {
    this.leadService.BuscarPorId(leadId).subscribe({
      next: (response) => {
        if (!response?.status || !response.dados) {
          this.toast.error(response?.mensagem || 'Lead não encontrado', 'Erro');
          return;
        }
        this.aplicarLead(response.dados);
        // Veio do arraste no Kanban para uma etapa que exige dados (ex.: Perdido)
        if (etapaDestinoId) this.formulario.patchValue({ etapaFunilId: etapaDestinoId });
      },
      error: (err) => this.toast.error(err.error?.mensagem || 'Erro ao carregar o lead', 'Erro')
    });
  }

  private aplicarLead(lead: Lead): void {
    this.lead = lead;
    this.followUps = lead.followUps ?? [];
    this.formulario.patchValue({
      id: lead.id,
      nome: lead.nome,
      telefone: lead.telefone,
      email: lead.email,
      canalOrigem: lead.canalOrigem,
      campanhaId: lead.campanhaId,
      profissionalId: lead.profissionalId,
      etapaFunilId: lead.etapaFunilId,
      observacao: lead.observacao,
      motivoPerdaId: lead.motivoPerdaId
    });
  }

  // Etapas e campanhas podem ter mudado na tela de Configurações — recarrega a cada abertura
  private carregarListas(): void {
    this.etapaFunilService.Listar().subscribe({
      next: (r) => { if (r?.dados) this.listaEtapas = r.dados; },
      error: (err) => console.error('Erro ao buscar etapas do funil:', err)
    });
    this.campanhaService.Listar().subscribe({
      next: (r) => { if (r?.dados) this.listaCampanhas = r.dados; },
      error: (err) => console.error('Erro ao buscar campanhas:', err)
    });
  }

  private getProfissionais(): void {
    this.profissionalService.Listar().subscribe({
      next: (r) => {
        // Profissional.id vem tipado como string no front; o Lead usa number
        if (r?.dados) this.listaProfissionais = r.dados.map(p => ({ id: Number(p.id), nome: p.nome, sobrenome: p.sobrenome }));
      },
      error: (err) => console.error('Erro ao buscar profissionais:', err)
    });
  }

  private recarregarFollowUps(): void {
    if (!this.lead) return;
    this.followUpService.Listar(this.lead.id).subscribe({
      next: (r) => { if (r?.status && r.dados) this.followUps = r.dados; },
      error: (err) => console.error('Erro ao buscar follow-ups:', err)
    });
  }

  // ===================== Getters de template =====================

  get isEdicao(): boolean {
    return !!this.lead?.id;
  }

  get etapaSelecionadaId(): number {
    return Number(this.formulario.get('etapaFunilId')?.value) || 0;
  }

  get isEtapaPerdido(): boolean {
    return this.etapaSelecionadaId === ETAPA_PERDIDO_ID;
  }

  // Converter só a partir do estado SALVO (lead em "Ganho" no backend e ainda não convertido)
  get podeConverter(): boolean {
    return !!this.lead && this.lead.isGanho && this.lead.etapaFunilId === ETAPA_GANHO_ID && !this.lead.pacienteId;
  }

  get etapaMudou(): boolean {
    return this.isEdicao && this.etapaSelecionadaId !== this.lead!.etapaFunilId;
  }

  get scriptSugerido(): string | null | undefined {
    return this.listaEtapas.find(e => e.id === this.etapaSelecionadaId)?.scriptSugerido;
  }

  // ===================== Ações do lead =====================

  private validarMotivoPerda(): boolean {
    if (this.isEtapaPerdido && !this.formulario.get('motivoPerdaId')?.value) {
      this.toast.error('Informe o motivo da perda.', 'Campo obrigatório');
      return false;
    }
    return true;
  }

  onSubmit(): void {
    const v = this.formulario.value;

    if (!v.nome?.trim() || !v.telefone?.trim()) {
      this.toast.error('Nome e telefone são obrigatórios.', 'Campos obrigatórios');
      return;
    }
    if (!this.validarMotivoPerda()) return;

    this.isLoading = true;

    const operacao = this.isEdicao
      ? this.leadService.Editar({
          id: this.lead!.id,
          nome: v.nome.trim(),
          telefone: v.telefone.trim(),
          email: v.email || null,
          canalOrigem: v.canalOrigem || null,
          campanhaId: v.campanhaId ? Number(v.campanhaId) : null,
          etapaFunilId: Number(v.etapaFunilId),
          profissionalId: v.profissionalId ? Number(v.profissionalId) : null,
          observacao: v.observacao || null,
          motivoPerdaId: this.isEtapaPerdido ? v.motivoPerdaId : null
        } as LeadEdicaoDto)
      : this.leadService.Criar({
          nome: v.nome.trim(),
          telefone: v.telefone.trim(),
          email: v.email || null,
          canalOrigem: v.canalOrigem || null,
          campanhaId: v.campanhaId ? Number(v.campanhaId) : null,
          etapaFunilId: v.etapaFunilId ? Number(v.etapaFunilId) : null,
          profissionalId: v.profissionalId ? Number(v.profissionalId) : null,
          observacao: v.observacao || null
        } as LeadCreateDto);

    operacao.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao salvar o lead', 'Erro');
          return; // modal permanece aberto
        }
        this.toast.success(this.isEdicao ? 'Lead atualizado com sucesso!' : 'Lead criado com sucesso!', 'Sucesso');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.mensagem || 'Ocorreu um erro ao salvar. Tente novamente.', 'Erro');
      }
    });
  }

  // Move só a etapa (sem salvar os demais campos editados)
  moverEtapa(): void {
    if (!this.lead || !this.etapaMudou) return;
    if (!this.validarMotivoPerda()) return;

    this.isMovendo = true;
    this.leadService.MoverEtapa({
      leadId: this.lead.id,
      novaEtapaFunilId: this.etapaSelecionadaId,
      motivoPerdaId: this.isEtapaPerdido ? this.formulario.get('motivoPerdaId')?.value : null
    }).subscribe({
      next: (response) => {
        this.isMovendo = false;
        if (!response?.status || !response.dados) {
          this.toast.error(response?.mensagem || 'Erro ao mover o lead', 'Erro');
          return;
        }
        this.toast.success(response.mensagem, 'Sucesso');
        // Mantém o modal aberto (ex.: para converter em paciente logo em seguida)
        this.lead = { ...response.dados, followUps: this.followUps };
        this.formulario.patchValue({ etapaFunilId: response.dados.etapaFunilId, motivoPerdaId: response.dados.motivoPerdaId });
        this.dataAtualizado.emit();
      },
      error: (err) => {
        this.isMovendo = false;
        this.toast.error(err.error?.mensagem || 'Erro ao mover o lead', 'Erro');
      }
    });
  }

  converterEmPaciente(): void {
    if (!this.podeConverter) return;

    this.isConvertendo = true;
    this.leadService.ConverterEmPaciente(this.lead!.id).subscribe({
      next: (response) => {
        this.isConvertendo = false;
        if (!response?.status || !response.dados) {
          this.toast.error(response?.mensagem || 'Erro ao converter o lead', 'Erro');
          return;
        }
        this.toast.success(response.mensagem, 'Lead convertido');
        this.lead = { ...response.dados, followUps: this.followUps };
        this.tabService.clearCacheByPrefix('paciente-list-');
        this.dataAtualizado.emit();
      },
      error: (err) => {
        this.isConvertendo = false;
        this.toast.error(err.error?.mensagem || 'Erro ao converter o lead', 'Erro');
      }
    });
  }

  abrirPaciente(): void {
    if (!this.lead?.pacienteId) return;
    const pacienteId = this.lead.pacienteId;
    this.fecharModal();
    this.tabService.openTab({ path: `/pacientes/listar/${pacienteId}`, title: 'Pacientes' });
  }

  excluir(): void {
    if (!this.lead) return;

    this.isLoading = true;
    this.leadService.Delete(this.lead.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.confirmandoExclusao = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao excluir o lead', 'Erro');
          return;
        }
        this.toast.success('Lead excluído com sucesso!', 'Sucesso');
        this.dataAtualizado.emit();
        this.fecharModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.confirmandoExclusao = false;
        this.toast.error(err.error?.mensagem || 'Erro ao excluir o lead', 'Erro');
      }
    });
  }

  copiarScript(): void {
    const script = this.scriptSugerido;
    if (!script) return;
    const nome = (this.formulario.get('nome')?.value || '').split(' ')[0];
    const texto = script.replace(/\[Nome\]/gi, nome || '');
    navigator.clipboard?.writeText(texto).then(
      () => this.toast.success('Script copiado para a área de transferência.', 'Copiado'),
      () => this.toast.error('Não foi possível copiar o script.', 'Erro')
    );
  }

  // ===================== Follow-ups =====================

  toggleFormFollowUp(): void {
    this.mostrarFormFollowUp = !this.mostrarFormFollowUp;
    if (!this.mostrarFormFollowUp) this.resetarFormFollowUp();
  }

  salvarFollowUp(): void {
    if (!this.lead) return;
    const v = this.formFollowUp.value;

    if (!v.mensagemEnviada?.trim() && !v.respostaRecebida?.trim()) {
      this.toast.error('Informe a mensagem enviada ou a resposta recebida.', 'Campo obrigatório');
      return;
    }

    const dto: FollowUpCreateDto = {
      leadId: this.lead.id,
      etapaFunilId: this.lead.etapaFunilId,
      canal: v.canal || null,
      mensagemEnviada: v.mensagemEnviada || null,
      respostaRecebida: v.respostaRecebida || null,
      proximaAcaoData: v.proximaAcaoData ? DateHelper.toBackendDate(v.proximaAcaoData) : null,
      proximaAcaoDescricao: v.proximaAcaoDescricao || null
      // dataContato omitido → backend usa o momento atual (UTC)
    };

    this.isLoadingFollowUp = true;
    this.followUpService.Criar(dto).subscribe({
      next: (response) => {
        this.isLoadingFollowUp = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao registrar follow-up', 'Erro');
          return;
        }
        this.toast.success('Follow-up registrado!', 'Sucesso');
        this.followUps = response.dados ?? [];
        this.mostrarFormFollowUp = false;
        this.resetarFormFollowUp();
        this.dataAtualizado.emit(); // DataUltimaInteracao do lead mudou
      },
      error: (err) => {
        this.isLoadingFollowUp = false;
        this.toast.error(err.error?.mensagem || 'Erro ao registrar follow-up', 'Erro');
      }
    });
  }

  // Indicador do card: Concluído > Respondido (verde) > Próxima ação (amarelo) > Pendente (cinza)
  statusFollowUp(f: FollowUp): 'concluido' | 'respondido' | 'agendado' | 'pendente' {
    if (f.concluido) return 'concluido';
    if (f.respostaRecebida?.trim()) return 'respondido';
    if (f.proximaAcaoData) return 'agendado';
    return 'pendente';
  }

  // Clique no card: expande/recolhe o accordion de edição
  toggleFollowUp(f: FollowUp): void {
    if (f.concluido) return; // concluído = somente leitura
    this.followUpConcluindoId = null;
    if (this.followUpExpandidoId === f.id) {
      this.fecharEdicaoFollowUp();
      return;
    }
    this.followUpExpandidoId = f.id;
    this.followUpParaExcluir = null;
    this.formEdicaoFollowUp.reset({
      respostaRecebida: f.respostaRecebida || '',
      // Data sem hora: 'YYYY-MM-DD' para o input date, sem passar por toISOString()
      proximaAcaoData: f.proximaAcaoData ? DateHelper.toBackendDate(f.proximaAcaoData) : null,
      proximaAcaoDescricao: f.proximaAcaoDescricao || ''
    });
  }

  fecharEdicaoFollowUp(): void {
    this.followUpExpandidoId = null;
    this.formEdicaoFollowUp.reset({ respostaRecebida: '', proximaAcaoData: null, proximaAcaoDescricao: '' });
  }

  salvarEdicaoFollowUp(f: FollowUp): void {
    if (f.concluido) return; // concluído = somente leitura (backend também bloqueia)
    const v = this.formEdicaoFollowUp.value;

    const dto: FollowUpEdicaoDto = {
      id: f.id,
      respostaRecebida: v.respostaRecebida?.trim() || null,
      proximaAcaoData: v.proximaAcaoData ? DateHelper.toBackendDate(v.proximaAcaoData) : null,
      proximaAcaoDescricao: v.proximaAcaoDescricao?.trim() || null
    };

    this.isSalvandoEdicaoFollowUp = true;
    this.followUpService.Editar(dto).subscribe({
      next: (response) => {
        this.isSalvandoEdicaoFollowUp = false;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao atualizar follow-up', 'Erro');
          return; // accordion permanece aberto
        }
        this.toast.success('Follow-up atualizado!', 'Sucesso');
        this.followUps = response.dados ?? [];
        this.fecharEdicaoFollowUp();
      },
      error: (err) => {
        this.isSalvandoEdicaoFollowUp = false;
        this.toast.error(err.error?.mensagem || 'Erro ao atualizar follow-up', 'Erro');
      }
    });
  }

  // ===================== Conclusão de follow-up =====================

  // Abre o formulário inline de conclusão (nada é salvo até escolher uma das duas ações)
  iniciarConclusao(f: FollowUp): void {
    if (f.concluido) return;
    this.followUpExpandidoId = null;
    this.followUpParaExcluir = null;
    this.followUpConcluindoId = f.id;
    this.formProximaAcao.reset({ proximaAcaoData: null, proximaAcaoDescricao: '', canal: f.canal || 'WhatsApp' });
  }

  cancelarConclusao(): void {
    this.followUpConcluindoId = null;
  }

  concluirFollowUp(f: FollowUp, criarProximaAcao: boolean): void {
    if (!this.lead || f.concluido) return;
    const v = this.formProximaAcao.value;

    if (criarProximaAcao && !v.proximaAcaoData && !v.proximaAcaoDescricao?.trim()) {
      this.toast.error('Informe a data ou o que será feito na próxima ação.', 'Próxima ação');
      return;
    }

    // O Editar grava resposta/próxima ação como vierem: reenvia os valores atuais para não apagá-los
    const dtoConclusao: FollowUpEdicaoDto = {
      id: f.id,
      respostaRecebida: f.respostaRecebida ?? null,
      proximaAcaoData: f.proximaAcaoData ? DateHelper.toBackendDate(f.proximaAcaoData) : null,
      proximaAcaoDescricao: f.proximaAcaoDescricao ?? null,
      concluido: true
    };

    this.isConcluindoFollowUp = true;
    this.followUpService.Editar(dtoConclusao).subscribe({
      next: (response) => {
        if (!response?.status) {
          this.isConcluindoFollowUp = false;
          this.toast.error(response?.mensagem || 'Erro ao concluir follow-up', 'Erro');
          return; // formulário permanece aberto
        }
        this.followUps = response.dados ?? [];

        if (!criarProximaAcao) {
          this.isConcluindoFollowUp = false;
          this.followUpConcluindoId = null;
          this.toast.success('Follow-up concluído!', 'Sucesso');
          return;
        }
        this.criarProximaAcao(v);
      },
      error: (err) => {
        this.isConcluindoFollowUp = false;
        this.toast.error(err.error?.mensagem || 'Erro ao concluir follow-up', 'Erro');
      }
    });
  }

  // Próxima ação vira um novo follow-up pendente. dataContato omitido → backend usa o momento atual (hoje)
  private criarProximaAcao(v: { proximaAcaoData: string | null; proximaAcaoDescricao: string; canal: string }): void {
    const dto: FollowUpCreateDto = {
      leadId: this.lead!.id,
      etapaFunilId: this.lead!.etapaFunilId,
      canal: v.canal || null,
      proximaAcaoData: v.proximaAcaoData ? DateHelper.toBackendDate(v.proximaAcaoData) : null,
      proximaAcaoDescricao: v.proximaAcaoDescricao?.trim() || null
    };

    this.followUpService.Criar(dto).subscribe({
      next: (response) => {
        this.isConcluindoFollowUp = false;
        if (!response?.status) {
          // A conclusão já foi salva; mantém o formulário aberto para tentar criar a próxima ação de novo
          this.toast.error(response?.mensagem || 'Follow-up concluído, mas houve erro ao criar a próxima ação', 'Erro');
          return;
        }
        this.followUps = response.dados ?? [];
        this.followUpConcluindoId = null;
        this.toast.success('Follow-up concluído e próxima ação registrada!', 'Sucesso');
        this.dataAtualizado.emit(); // DataUltimaInteracao do lead mudou
      },
      error: (err) => {
        this.isConcluindoFollowUp = false;
        this.toast.error(err.error?.mensagem || 'Follow-up concluído, mas houve erro ao criar a próxima ação', 'Erro');
      }
    });
  }

  excluirFollowUp(id: number): void {
    this.followUpService.Delete(id).subscribe({
      next: (response) => {
        this.followUpParaExcluir = null;
        if (!response?.status) {
          this.toast.error(response?.mensagem || 'Erro ao excluir follow-up', 'Erro');
          return;
        }
        this.toast.success('Follow-up excluído.', 'Sucesso');
        this.followUps = response.dados ?? [];
      },
      error: (err) => {
        this.followUpParaExcluir = null;
        this.toast.error(err.error?.mensagem || 'Erro ao excluir follow-up', 'Erro');
        this.recarregarFollowUps();
      }
    });
  }
}
