import { Injectable } from '@angular/core';
import { Paciente } from '../_module/pacienteModule';

export type ModeloProntuario = 'completo' | 'resumido' | 'anamnese';

type BrandInfo = {
  nome: string;
  cnpj: string;
  endereco: string;
  cidadeUf: string;
  telefone: string;
  email: string;
  logoUrl: string;
};

@Injectable({ providedIn: 'root' })
export class ProntuarioPrintService {
  print(paciente: Paciente, modelo?: ModeloProntuario): void {
    const selected = modelo || this.getPreferredModel() || 'completo';
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Não foi possível abrir a janela de impressão. Verifique o bloqueio de pop-ups.');
      return;
    }

    printWindow.document.write(this.buildHtml(paciente, selected));
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  private getPreferredModel(): ModeloProntuario | null {
    try {
      const value = localStorage.getItem('modeloProntuario');
      if (value === 'completo' || value === 'resumido' || value === 'anamnese') return value;
    } catch {
      // O modelo completo permanece como padrão quando o armazenamento não está disponível.
    }
    return null;
  }

  private buildHtml(paciente: Paciente, modelo: ModeloProntuario): string {
    const title = `Prontuário - ${paciente.nome || 'Paciente'}`;
    const body = modelo === 'completo'
      ? this.templateCompleto(paciente)
      : modelo === 'resumido'
        ? this.templateResumido(paciente)
        : this.templateAnamnese(paciente);

    return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${this.escapeHtml(title)}</title>
    <style>
      :root {
        --ink: #17212f;
        --muted: #64748b;
        --soft: #f5f8f7;
        --line: #dbe4e1;
        --accent: #177c58;
        --accent-dark: #0e5c40;
        --accent-soft: #e8f5ef;
        --paper: #ffffff;
      }

      @page { size: A4 portrait; margin: 13mm 12mm 15mm; }

      * { box-sizing: border-box; }
      html, body { width: 100%; max-width: 100%; }
      html { background: #edf2f0; }
      body {
        margin: 0;
        padding: 22px;
        background: var(--paper);
        color: var(--ink);
        font-family: Inter, Roboto, "Segoe UI", Arial, sans-serif;
        font-size: 12px;
        line-height: 1.45;
        -webkit-font-smoothing: antialiased;
      }

      img, svg { max-width: 100%; }
      h1, h2, h3, p { margin-top: 0; }
      h1, h2, h3, .label, .record-date { break-after: avoid; page-break-after: avoid; }
      p:last-child { margin-bottom: 0; }

      .document { width: 100%; max-width: 100%; margin: 0 auto; }
      .brandbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(160px, auto);
        gap: 18px;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 2px solid var(--accent);
      }
      .brand-left { display: flex; min-width: 0; gap: 12px; align-items: center; }
      .brand-logo { width: auto; height: 44px; max-width: 128px; object-fit: contain; flex: 0 0 auto; }
      .brand-copy { min-width: 0; }
      .brand-title { color: var(--accent-dark); font-size: 18px; font-weight: 750; line-height: 1.15; }
      .brand-sub, .brand-right { color: var(--muted); font-size: 10.5px; }
      .brand-right { min-width: 0; text-align: right; }

      .document-heading {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 16px;
        align-items: end;
        margin: 15px 0 12px;
      }
      .eyebrow { margin-bottom: 3px; color: var(--accent); font-size: 9.5px; font-weight: 750; letter-spacing: .11em; text-transform: uppercase; }
      .document-heading h1 { margin-bottom: 2px; font-size: 21px; line-height: 1.15; }
      .document-description { max-width: 540px; margin: 0; color: var(--muted); font-size: 11px; }
      .document-meta { text-align: right; color: var(--muted); font-size: 10px; white-space: nowrap; }
      .document-meta strong { display: block; color: var(--ink); font-size: 11px; }

      .patient-card {
        display: grid;
        grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr) minmax(0, 1fr);
        border: 1px solid var(--line);
        border-left: 4px solid var(--accent);
        border-radius: 8px;
        overflow: hidden;
        background: var(--paper);
      }
      .patient-primary, .patient-cell { min-width: 0; padding: 10px 12px; }
      .patient-cell { border-left: 1px solid var(--line); }
      .patient-name { margin: 1px 0 2px; font-size: 16px; font-weight: 750; line-height: 1.2; }
      .patient-id { color: var(--muted); font-size: 10px; }

      .section { width: 100%; max-width: 100%; margin-top: 16px; }
      .section-title {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 7px;
        color: var(--accent-dark);
        font-size: 13px;
        font-weight: 750;
      }
      .section-number {
        display: inline-grid;
        width: 20px;
        height: 20px;
        place-items: center;
        border-radius: 50%;
        background: var(--accent);
        color: #fff;
        font-size: 9px;
      }

      .panel { width: 100%; max-width: 100%; border: 1px solid var(--line); border-radius: 8px; background: var(--paper); }
      .panel-body { padding: 11px 12px; }
      .panel-soft { background: var(--soft); }
      .grid { display: grid; width: 100%; max-width: 100%; gap: 9px 12px; }
      .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .field { min-width: 0; }
      .field-wide { grid-column: 1 / -1; }
      .label { margin-bottom: 2px; color: var(--muted); font-size: 8.5px; font-weight: 750; letter-spacing: .07em; text-transform: uppercase; }
      .value { min-width: 0; color: var(--ink); font-size: 11.5px; }
      .empty { color: #94a3b8; font-style: italic; }
      .text-block { white-space: pre-wrap; widows: 3; orphans: 3; }

      .kpis { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 10px; }
      .kpi { min-width: 0; padding: 8px 10px; border: 1px solid var(--line); border-radius: 7px; background: var(--soft); }
      .kpi-value { color: var(--accent-dark); font-size: 18px; font-weight: 800; line-height: 1.1; }
      .kpi-label { margin-top: 2px; color: var(--muted); font-size: 9px; }

      .highlight { padding: 12px 14px; border: 1px solid #b8dccc; border-radius: 8px; background: var(--accent-soft); }
      .highlight .value { font-size: 12px; }

      .record { width: 100%; max-width: 100%; margin-bottom: 9px; border: 1px solid var(--line); border-radius: 8px; }
      .record:last-child { margin-bottom: 0; }
      .record-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(110px, auto);
        gap: 12px;
        align-items: center;
        padding: 7px 10px;
        border-bottom: 1px solid var(--line);
        background: var(--soft);
      }
      .record-date { color: var(--accent-dark); font-weight: 750; }
      .record-professional { min-width: 0; color: var(--muted); font-size: 10px; text-align: right; }
      .record-body { min-width: 0; padding: 10px; }
      .subsection { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--line); }
      .subsection-title { margin-bottom: 6px; color: var(--accent-dark); font-size: 10.5px; font-weight: 750; }

      .activity-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
      .activity { min-width: 0; padding: 7px 8px; border: 1px solid var(--line); border-radius: 6px; background: #fff; }
      .activity-head { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: start; }
      .activity-title { font-weight: 700; }
      .activity-description { margin-top: 3px; color: var(--muted); font-size: 10px; white-space: pre-wrap; }
      .pill { display: inline-block; padding: 1px 6px; border: 1px solid #b8dccc; border-radius: 999px; color: var(--accent-dark); font-size: 9px; white-space: nowrap; }

      .table-wrap { width: 100%; max-width: 100%; overflow: visible; border: 1px solid var(--line); border-radius: 6px; }
      table { width: 100%; max-width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9.5px; }
      thead { display: table-header-group; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      th, td { min-width: 0; padding: 5px 6px; border-bottom: 1px solid var(--line); vertical-align: top; text-align: left; }
      th { background: var(--soft); color: var(--muted); font-size: 8px; font-weight: 750; letter-spacing: .04em; text-transform: uppercase; }
      tbody tr:last-child td { border-bottom: 0; }
      th:nth-child(n+3), td:nth-child(n+3) { text-align: center; }
      .col-description { width: 27%; }
      .col-notes { width: 33%; }
      .col-small { width: 10%; }

      .timeline { margin-left: 7px; padding-left: 14px; border-left: 2px solid #c5ddd3; }
      .timeline-item { position: relative; margin-bottom: 10px; padding: 9px 10px; border: 1px solid var(--line); border-radius: 7px; }
      .timeline-item::before { position: absolute; top: 13px; left: -20px; width: 8px; height: 8px; border: 2px solid #fff; border-radius: 50%; background: var(--accent); content: ""; }
      .timeline-item:last-child { margin-bottom: 0; }

      .signature-area { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px; margin-top: 28px; break-inside: avoid; page-break-inside: avoid; }
      .signature { padding-top: 7px; border-top: 1px solid #87928e; color: var(--muted); font-size: 9px; text-align: center; }
      .document-note { margin-top: 15px; color: var(--muted); font-size: 8.5px; text-align: center; }

      .brand-title, .brand-sub, .brand-right, .patient-name, .patient-id, .value,
      .record-professional, .activity-title, .activity-description, th, td {
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      .record, .timeline-item { box-decoration-break: clone; -webkit-box-decoration-break: clone; }

      .keep-together, .kpi, .signature-area {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      @media screen and (max-width: 680px) {
        body { padding: 12px; }
        .brandbar, .document-heading, .patient-card, .grid-2, .grid-3, .activity-list { grid-template-columns: 1fr; }
        .brand-right, .document-meta, .record-professional { text-align: left; }
        .patient-cell { border-top: 1px solid var(--line); border-left: 0; }
      }

      @media print {
        html, body { background: #fff; }
        body { padding: 0; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .document { width: auto; max-width: none; }
        .record { break-inside: auto; page-break-inside: auto; }
        .record-header { break-after: avoid; page-break-after: avoid; }
        .record-body { break-before: avoid; page-break-before: avoid; }
      }
    </style>
  </head>
  <body>
    <main class="document">
      ${this.templateBrandBar(this.getBrandInfo())}
      ${body}
    </main>
  </body>
</html>`;
  }

  private templateCompleto(p: Paciente): string {
    const evolucoes = this.getEvolucoes(p);
    const totalAtividades = evolucoes.reduce(
      (total, evolucao) => total + (Array.isArray(evolucao.atividades) ? evolucao.atividades.length : 0), 0);
    const totalExercicios = evolucoes.reduce(
      (total, evolucao) => total + (Array.isArray(evolucao.exercicios) ? evolucao.exercicios.length : 0), 0);

    return `
      ${this.templateDocumentHeading(p, 'Prontuário completo', 'Registro longitudinal com identificação, dados clínicos e histórico detalhado das evoluções.')}
      ${this.templatePatientCard(p)}
      <div class="kpis keep-together">
        ${this.kpi('Evoluções registradas', evolucoes.length)}
        ${this.kpi('Atividades prescritas', totalAtividades)}
        ${this.kpi('Exercícios prescritos', totalExercicios)}
      </div>
      <section class="section">
        ${this.sectionTitle('1', 'Dados clínicos atuais')}
        <div class="panel panel-soft"><div class="panel-body grid grid-2">
          ${this.field('Diagnóstico / observações clínicas', p.breveDiagnostico, true)}
          ${this.field('Medicamentos em uso', p.medicamento, true)}
          ${this.field('Último atendimento', this.formatDate(p.dataUltimoAtendimento))}
          ${this.field('Plano atual', p.plano?.descricao)}
          ${this.field('Convênio', p.convenio?.nome || 'Particular')}
          ${this.field('Profissão', p.profissao)}
        </div></div>
      </section>
      <section class="section">
        ${this.sectionTitle('2', 'Cadastro e contato')}
        <div class="panel"><div class="panel-body grid grid-3">
          ${this.field('E-mail', p.email)}
          ${this.field('Telefone', this.formatPhone(p.telefone))}
          ${this.field('Celular', this.formatPhone(p.celular))}
          ${this.field('Estado civil', p.estadoCivil)}
          ${this.field('Preferência de contato', p.preferenciaDeContato)}
          ${this.field('Como conheceu', p.comoConheceu)}
          ${this.field('Endereço', this.formatAddress(p), true)}
        </div></div>
      </section>
      <section class="section">
        ${this.sectionTitle('3', 'Histórico de evoluções')}
        ${evolucoes.length
          ? evolucoes.map((evolucao, index) => this.renderEvolucaoCompleta(evolucao, evolucoes.length - index)).join('')
          : this.emptyPanel('Nenhuma evolução clínica foi registrada para este paciente.')}
      </section>
      ${this.templateSignature()}
      ${this.templateDocumentNote('Documento clínico completo. Preserve a confidencialidade destas informações.')}
    `;
  }

  private templateResumido(p: Paciente): string {
    const evolucoes = this.getEvolucoes(p);
    const ultimaEvolucao = evolucoes[0];
    return `
      ${this.templateDocumentHeading(p, 'Resumo clínico', 'Visão objetiva do estado atual do paciente e do registro clínico mais recente.')}
      ${this.templatePatientCard(p, true)}
      <section class="section">
        ${this.sectionTitle('1', 'Síntese clínica')}
        <div class="highlight">${this.field('Diagnóstico / informação principal', p.breveDiagnostico, true)}</div>
      </section>
      <section class="section">
        ${this.sectionTitle('2', 'Informações atuais')}
        <div class="panel"><div class="panel-body grid grid-2">
          ${this.field('Medicamentos em uso', p.medicamento, true)}
          ${this.field('Último atendimento', this.formatDate(p.dataUltimoAtendimento))}
          ${this.field('Plano atual', p.plano?.descricao)}
          ${this.field('Convênio', p.convenio?.nome || 'Particular')}
        </div></div>
      </section>
      <section class="section">
        ${this.sectionTitle('3', 'Última evolução')}
        ${ultimaEvolucao
          ? `<article class="record">${this.renderRecordHeader(ultimaEvolucao)}<div class="record-body text-block">${this.displayValue(ultimaEvolucao.observacao)}</div></article>`
          : this.emptyPanel('Nenhuma evolução clínica foi registrada para este paciente.')}
      </section>
      <div class="kpis keep-together">
        ${this.kpi('Evoluções no histórico', evolucoes.length)}
        ${this.kpi('Atividades na última evolução', Array.isArray(ultimaEvolucao?.atividades) ? ultimaEvolucao.atividades.length : 0)}
        ${this.kpi('Exercícios na última evolução', Array.isArray(ultimaEvolucao?.exercicios) ? ultimaEvolucao.exercicios.length : 0)}
      </div>
      ${this.templateSignature()}
      ${this.templateDocumentNote('Resumo clínico. Consulte o prontuário completo para o histórico detalhado.')}
    `;
  }

  private templateAnamnese(p: Paciente): string {
    const evolucoes = this.getEvolucoes(p);
    return `
      ${this.templateDocumentHeading(p, 'Anamnese e histórico clínico', 'Organização das informações pessoais, queixa clínica, medicamentos e antecedentes registrados.')}
      ${this.templatePatientCard(p, true)}
      <section class="section">
        ${this.sectionTitle('1', 'Identificação e perfil')}
        <div class="panel"><div class="panel-body grid grid-3">
          ${this.field('Data de nascimento', this.formatBirthDate(p.dataNascimento))}
          ${this.field('Sexo', p.sexo)}
          ${this.field('Estado civil', p.estadoCivil)}
          ${this.field('Profissão', p.profissao)}
          ${this.field('Responsável', this.formatBoolean(p.responsavel))}
          ${this.field('Convênio', p.convenio?.nome || 'Particular')}
        </div></div>
      </section>
      <section class="section">
        ${this.sectionTitle('2', 'Queixa e contexto clínico')}
        <div class="highlight">${this.field('Queixa principal / diagnóstico informado', p.breveDiagnostico, true)}</div>
        <div class="panel" style="margin-top: 8px;"><div class="panel-body grid grid-2">
          ${this.field('Medicamentos em uso', p.medicamento, true)}
          ${this.field('Último atendimento', this.formatDate(p.dataUltimoAtendimento))}
          ${this.field('Preferência de contato', p.preferenciaDeContato)}
          ${this.field('Como conheceu a clínica', p.comoConheceu)}
        </div></div>
      </section>
      <section class="section">
        ${this.sectionTitle('3', 'Histórico clínico registrado')}
        ${evolucoes.length
          ? `<div class="timeline">${evolucoes.map((evolucao) => `
              <article class="timeline-item">
                <div class="record-date">${this.formatDate(evolucao.dataEvolucao, true)}</div>
                <div class="record-professional" style="margin: 1px 0 6px; text-align: left;">${this.escapeHtml(this.getProfessionalLabel(evolucao))}</div>
                <div class="text-block">${this.displayValue(evolucao.observacao)}</div>
              </article>`).join('')}</div>`
          : this.emptyPanel('Nenhum registro clínico anterior foi encontrado.')}
      </section>
      ${this.templateSignature()}
      ${this.templateDocumentNote('Anamnese elaborada a partir das informações registradas no cadastro e nas evoluções clínicas.')}
    `;
  }

  private templateDocumentHeading(p: Paciente, title: string, description: string): string {
    return `
      <header class="document-heading keep-together">
        <div><div class="eyebrow">Documento clínico confidencial</div><h1>${this.escapeHtml(title)}</h1><p class="document-description">${this.escapeHtml(description)}</p></div>
        <div class="document-meta"><span>Emitido em</span><strong>${this.escapeHtml(this.formatDate(new Date(), true))}</strong><span>Paciente ${p.id ? `#${this.escapeHtml(p.id)}` : ''}</span></div>
      </header>`;
  }

  private templatePatientCard(p: Paciente, compact = false): string {
    return `
      <section class="patient-card keep-together">
        <div class="patient-primary"><div class="label">Paciente</div><div class="patient-name">${this.displayValue(p.nome)}</div><div class="patient-id">CPF: ${this.displayValue(this.formatCpf(p.cpf))}</div></div>
        <div class="patient-cell"><div class="label">Nascimento</div><div class="value">${this.displayValue(this.formatBirthDate(p.dataNascimento))}</div></div>
        <div class="patient-cell"><div class="label">${compact ? 'Contato principal' : 'Contato'}</div><div class="value">${this.displayValue(this.formatPhone(p.celular || p.telefone))}</div></div>
      </section>`;
  }

  private templateBrandBar(brand: BrandInfo): string {
    const address = [brand.endereco, brand.cidadeUf].filter(Boolean).join(' · ');
    const contact = [brand.telefone, brand.email].filter(Boolean).join(' · ');
    return `
      <header class="brandbar keep-together">
        <div class="brand-left"><img class="brand-logo" src="${this.escapeHtml(brand.logoUrl)}" alt="Logo da clínica" onerror="this.style.display='none'" /><div class="brand-copy"><div class="brand-title">${this.escapeHtml(brand.nome || 'SmartClinic')}</div>${address ? `<div class="brand-sub">${this.escapeHtml(address)}</div>` : ''}</div></div>
        <div class="brand-right">${brand.cnpj ? `<div>CNPJ: ${this.escapeHtml(brand.cnpj)}</div>` : ''}${contact ? `<div>${this.escapeHtml(contact)}</div>` : ''}</div>
      </header>`;
  }

  private renderEvolucaoCompleta(evolucao: any, sequence: number): string {
    return `
      <article class="record">
        ${this.renderRecordHeader(evolucao, `Evolução ${sequence}`)}
        <div class="record-body"><div class="label">Registro clínico</div><div class="value text-block">${this.displayValue(evolucao.observacao)}</div>${this.renderAtividades(evolucao.atividades)}${this.renderExercicios(evolucao.exercicios)}</div>
      </article>`;
  }

  private renderRecordHeader(evolucao: any, prefix = 'Evolução mais recente'): string {
    return `<div class="record-header"><div class="record-date">${this.escapeHtml(prefix)} · ${this.escapeHtml(this.formatDate(evolucao.dataEvolucao, true))}</div><div class="record-professional">${this.escapeHtml(this.getProfessionalLabel(evolucao))}</div></div>`;
  }

  private renderAtividades(list: any[] | undefined | null): string {
    const atividades = Array.isArray(list) ? list : [];
    if (!atividades.length) return '';
    return `
      <div class="subsection"><div class="subsection-title">Atividades prescritas</div><div class="activity-list">
        ${atividades.map((atividade) => `<div class="activity"><div class="activity-head"><div class="activity-title">${this.displayValue(atividade.titulo)}</div><span class="pill">${this.escapeHtml(this.formatTempo(atividade.tempo))}</span></div>${this.hasValue(atividade.descricao) ? `<div class="activity-description">${this.displayValue(atividade.descricao)}</div>` : ''}</div>`).join('')}
      </div></div>`;
  }

  private renderExercicios(list: any[] | undefined | null): string {
    const exercicios = Array.isArray(list) ? list : [];
    if (!exercicios.length) return '';
    return `
      <div class="subsection"><div class="subsection-title">Exercícios prescritos</div><div class="table-wrap"><table>
        <thead><tr><th class="col-description">Exercício</th><th class="col-notes">Observações</th><th class="col-small">Séries</th><th class="col-small">Repet.</th><th class="col-small">Tempo</th><th class="col-small">Carga</th></tr></thead>
        <tbody>${exercicios.map((exercicio) => `<tr><td>${this.displayValue(exercicio.descricao)}</td><td>${this.displayValue(exercicio.obs)}</td><td>${this.displayValue(exercicio.series)}</td><td>${this.displayValue(exercicio.repeticoes)}</td><td>${this.escapeHtml(this.formatTempo(exercicio.tempo))}</td><td>${this.escapeHtml(this.calcCarga(exercicio.series, exercicio.repeticoes))}</td></tr>`).join('')}</tbody>
      </table></div></div>`;
  }

  private templateSignature(): string {
    return `<div class="signature-area"><div class="signature">Profissional responsável · assinatura e registro</div><div class="signature">Paciente ou responsável · ciência</div></div>`;
  }

  private templateDocumentNote(text: string): string {
    return `<div class="document-note">${this.escapeHtml(text)}</div>`;
  }

  private sectionTitle(number: string, title: string): string {
    return `<h2 class="section-title"><span class="section-number">${this.escapeHtml(number)}</span>${this.escapeHtml(title)}</h2>`;
  }

  private field(label: string, value: unknown, wide = false): string {
    return `<div class="field${wide ? ' field-wide' : ''}"><div class="label">${this.escapeHtml(label)}</div><div class="value text-block">${this.displayValue(value)}</div></div>`;
  }

  private kpi(label: string, value: number): string {
    return `<div class="kpi"><div class="kpi-value">${this.escapeHtml(value)}</div><div class="kpi-label">${this.escapeHtml(label)}</div></div>`;
  }

  private emptyPanel(message: string): string {
    return `<div class="panel panel-soft keep-together"><div class="panel-body empty">${this.escapeHtml(message)}</div></div>`;
  }

  private getEvolucoes(p: Paciente): any[] {
    const evolucoes = Array.isArray(p.evolucoes) ? [...p.evolucoes] : [];
    return evolucoes.sort((a, b) => this.dateTimestamp(b.dataEvolucao) - this.dateTimestamp(a.dataEvolucao));
  }

  private getProfessionalLabel(evolucao: any): string {
    const professional = evolucao?.profissionalNome || evolucao?.profissional?.nome;
    if (this.hasValue(professional)) return `Responsável: ${String(professional)}`;
    if (this.hasValue(evolucao?.profissionalId)) return `Profissional: ${String(evolucao.profissionalId)}`;
    return 'Profissional não informado';
  }

  private formatAddress(p: Paciente): string {
    const street = [p.logradouro, p.numero].filter((value) => this.hasValue(value)).join(', ');
    return [street, p.complemento, p.bairro, p.cidade, p.uf, this.formatCep(p.cep)].filter((value) => this.hasValue(value)).join(' · ');
  }

  private formatBirthDate(value: unknown): string {
    const date = this.formatDate(value);
    const age = this.calculateAge(value);
    return age === null || date === '' ? date : `${date} · ${age} anos`;
  }

  private formatDate(value: unknown, includeTime = false): string {
    if (!this.hasValue(value)) return '';
    if (typeof value === 'string') {
      const dateOnly = /^(\d{4})-(\d{2})-(\d{2})(?:T00:00:00(?:\.\d+)?(?:Z)?)?$/.exec(value);
      if (dateOnly) return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('pt-BR', includeTime ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'short' }).format(date);
  }

  private calculateAge(value: unknown): number | null {
    if (!this.hasValue(value)) return null;
    const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null;
    const birthDate = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? age : null;
  }

  private formatCpf(value: unknown): string {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.length === 11 ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : String(value ?? '');
  }

  private formatPhone(value: unknown): string {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return String(value ?? '');
  }

  private formatCep(value: unknown): string {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.length === 8 ? digits.replace(/(\d{5})(\d{3})/, '$1-$2') : String(value ?? '');
  }

  private formatBoolean(value: unknown): string {
    if (value === true || value === 'true' || value === 'Sim' || value === 'S') return 'Sim';
    if (value === false || value === 'false' || value === 'Não' || value === 'N') return 'Não';
    return String(value ?? '');
  }

  private formatTempo(value: unknown): string {
    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes <= 0) return '—';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder ? `${hours}h ${remainder}min` : `${hours}h`;
  }

  private calcCarga(series: unknown, repeticoes: unknown): string {
    const seriesValue = Number(series);
    const repetitionsValue = Number(repeticoes);
    if (!Number.isFinite(seriesValue) || !Number.isFinite(repetitionsValue) || seriesValue <= 0 || repetitionsValue <= 0) return '—';
    return String(seriesValue * repetitionsValue);
  }

  private dateTimestamp(value: unknown): number {
    if (!this.hasValue(value)) return 0;
    const timestamp = new Date(String(value)).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  private displayValue(value: unknown): string {
    return this.hasValue(value) ? this.escapeHtml(value) : '<span class="empty">Não informado</span>';
  }

  private hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  private getBrandInfo(): BrandInfo {
    const base = (() => {
      try { return location.origin; } catch { return ''; }
    })();
    const get = (key: string) => {
      try { return localStorage.getItem(key) || ''; } catch { return ''; }
    };
    return {
      nome: get('empresa.nome') || 'SmartClinic',
      cnpj: get('empresa.cnpj'),
      endereco: get('empresa.endereco'),
      cidadeUf: get('empresa.cidadeUf'),
      telefone: get('empresa.telefone'),
      email: get('empresa.email'),
      logoUrl: base ? `${base}/assets/image/logo.png` : 'assets/image/logo.png',
    };
  }

  private escapeHtml(input: unknown): string {
    return String(input ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
