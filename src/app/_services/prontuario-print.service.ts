import { Injectable } from '@angular/core';
import { Paciente } from '../_module/pacienteModule';

export type ModeloProntuario = 'completo' | 'resumido' | 'anamnese';

@Injectable({ providedIn: 'root' })
export class ProntuarioPrintService {
  print(paciente: Paciente, modelo?: ModeloProntuario): void {
    const selected = modelo || this.getPreferredModel() || 'completo';
    const html = this.buildHtml(paciente, selected);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Não foi possível abrir a janela de impressão. Verifique bloqueio de pop-ups.');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

  private getPreferredModel(): ModeloProntuario | null {
    try {
      const v = localStorage.getItem('modeloProntuario');
      if (v === 'completo' || v === 'resumido' || v === 'anamnese') return v;
    } catch {}
    return null;
  }

  private buildHtml(p: Paciente, modelo: ModeloProntuario): string {
    const title = `Prontuário - ${p.nome || ''}`.trim();
    const brand = this.getBrandInfo();
    const body =
      modelo === 'completo'
        ? this.templateCompleto(p)
        : modelo === 'resumido'
        ? this.templateResumido(p)
        : this.templateAnamnese(p);

    return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${this.escapeHtml(title)}</title>
    <style>
      :root {
        --text:#1e293b; /* slate-800 */
        --muted:#64748b; /* slate-500 */
        --line:#e2e8f0; /* slate-200 */
        --accent:#198754; /* brand accent (Bootstrap success) */
        --brand:#0ea5a4; /* secondary brand (teal-ish) */
      }
      * { box-sizing: border-box; }
      body { font-family: Inter, Roboto, 'Segoe UI', Arial, Helvetica, sans-serif; color: var(--text); margin: 24px; }
      h1,h2,h3,h4 { margin: 0 0 8px; line-height: 1.25; }
      .brandbar { display:flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 3px solid var(--accent); margin-bottom: 16px; }
      .brand-left { display:flex; gap: 12px; align-items: center; }
      .brand-logo { height: 52px; width: auto; object-fit: contain; }
      .brand-title { font-size: 20px; font-weight: 700; }
      .brand-sub { font-size: 12px; color: var(--muted); }
      .brand-right { text-align: right; font-size: 12px; color: var(--muted); }
      .doc-title { font-size: 16px; font-weight: 600; margin-top: 4px; color: var(--accent); }
      .muted { color: var(--muted); }
      .section { margin: 16px 0; }
      .card { border:1px solid var(--line); border-radius: 10px; padding: 14px; margin-bottom: 10px; background: #fff; }
      .row { display:flex; flex-wrap: wrap; gap: 12px; }
      .col { flex:1 1 240px; }
      .label { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: .04em; }
      .value { font-size: 14px; }
      .evo-date { font-weight:600; color: var(--brand); margin-bottom: 6px; }
      .pill { display:inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; background: #e8faf4; color: var(--accent); border: 1px solid #97e7c0; }
      .grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .grid-3 { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
      .kpi { border:1px dashed var(--line); border-radius: 8px; padding: 10px; }
      .kpi .big { font-size: 22px; font-weight: 700; }
      @media print {
        body { margin: 1cm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        a { color: inherit; text-decoration: none; }
        .no-break { break-inside: avoid; page-break-inside: avoid; }
        .page-break { page-break-after: always; }
      }
    </style>
  </head>
  <body>
    ${this.templateBrandBar(brand)}
    ${body}
  </body>
</html>`;
  }

  private templateHeader(p: Paciente, subtitle: string): string {
    return `
      <div class="doc-title">Prontuário do Paciente · ${this.escapeHtml(subtitle)}</div>
      <div class="card">
        <div class="row">
          <div class="col"><div class="label">Nome</div><div class="value">${this.escapeHtml(p.nome || '-')}</div></div>
          <div class="col"><div class="label">CPF</div><div class="value">${this.escapeHtml(p.cpf || '-')}</div></div>
          <div class="col"><div class="label">Data Nascimento</div><div class="value">${this.escapeHtml(p.dataNascimento || '-')}</div></div>
          <div class="col"><div class="label">Contato</div><div class="value">${this.escapeHtml(p.celular || p.telefone || '-')}</div></div>
        </div>
        <div class="row">
          <div class="col"><div class="label">Endereço</div><div class="value">${this.escapeHtml([p.logradouro, p.numero, p.bairro, p.cidade, p.uf, p.cep].filter(Boolean).join(', ') || '-')}</div></div>
        </div>
        <div class="row">
          <div class="col"><div class="label">Convênio</div><div class="value">${this.escapeHtml(p.convenio?.nome || 'Particular')}</div></div>
          <div class="col"><div class="label">Plano</div><div class="value">${this.escapeHtml(p.plano?.descricao || '-')}</div></div>
          <div class="col"><div class="label">Emitido em</div><div class="value">${new Date().toLocaleString('pt-BR')}</div></div>
        </div>
      </div>
      ${this.renderResumoEvolucoes(p)}
    `;
  }

  private templateBrandBar(brand: { nome: string; cnpj: string; endereco: string; cidadeUf: string; telefone: string; email: string; logoUrl: string; }): string {
    return `
      <div class="brandbar">
        <div class="brand-left">
          <img class="brand-logo" src="${this.escapeHtml(brand.logoUrl)}" alt="Logo" />
          <div>
            <div class="brand-title">${this.escapeHtml(brand.nome || 'SmartClinic')}</div>
            <div class="brand-sub">${this.escapeHtml(brand.endereco)}</div>
            <div class="brand-sub">${this.escapeHtml(brand.cidadeUf)}</div>
          </div>
        </div>
        <div class="brand-right">
          ${brand.cnpj ? `CNPJ: ${this.escapeHtml(brand.cnpj)}<br/>` : ''}
          ${this.escapeHtml(brand.telefone)}<br/>
          ${this.escapeHtml(brand.email)}
        </div>
      </div>
    `;
  }

  private getBrandInfo() {
    const base = ((): string => {
      try { return location.origin; } catch { return ''; }
    })();
    const logo = base ? `${base}/assets/image/logo.png` : 'assets/image/logo.png';
    const get = (k: string) => {
      try { return localStorage.getItem(k) || ''; } catch { return ''; }
    };
    return {
      nome: get('empresa.nome') || 'SmartClinic',
      cnpj: get('empresa.cnpj') || '',
      endereco: get('empresa.endereco') || '',
      cidadeUf: get('empresa.cidadeUf') || '',
      telefone: get('empresa.telefone') || '',
      email: get('empresa.email') || '',
      logoUrl: logo,
    };
  }

  private templateCompleto(p: Paciente): string {
    const evolucoes = (p.evolucoes || []).slice().sort((a: any, b: any) => (a.dataEvolucao || '').localeCompare(b.dataEvolucao || '')).reverse();
    return `
      ${this.templateHeader(p, 'Modelo Completo')}
      <div class="section">
        <h2>Dados Clínicos</h2>
        <div class="card">
          <div class="row">
            <div class="col"><div class="label">Breve Diagnóstico</div><div class="value">${this.escapeHtml(p.breveDiagnostico || '-')}</div></div>
            <div class="col"><div class="label">Medicamentos</div><div class="value">${this.escapeHtml(p.medicamento || '-')}</div></div>
            <div class="col"><div class="label">Último Atendimento</div><div class="value">${this.escapeHtml(p.dataUltimoAtendimento || '-')}</div></div>
          </div>
        </div>
      </div>
      <div class="section">
      <h2 class="no-break">Evoluções</h2>
      ${(evolucoes.length ? evolucoes.map((e: any) => `
        <div class="card no-break">
            <div class="evo-date">${this.escapeHtml(e.dataEvolucao || '')}</div>
            <div class="muted" style="font-size:12px; margin-bottom:6px;">Responsável: ${this.escapeHtml(e.profissionalNome || e.profissionalId || '-')}</div>
            <div>${this.escapeHtml(e.observacao || '-')}</div>
            ${this.renderAtividades(e.atividades)}
            ${this.renderExercicios(e.exercicios)}
          </div>
        `).join('') : '<div class="muted">Sem evoluções registradas.</div>')}
      </div>
    `;
  }

  private templateResumido(p: Paciente): string {
    const ultimaEvolucao = (p.evolucoes || []).slice().sort((a: any, b: any) => (a.dataEvolucao || '').localeCompare(b.dataEvolucao || '')).pop();
    return `
      ${this.templateHeader(p, 'Modelo Resumido')}
      <div class="section">
        <div class="card">
          <div class="row">
            <div class="col"><div class="label">Breve Diagnóstico</div><div class="value">${this.escapeHtml(p.breveDiagnostico || '-')}</div></div>
            <div class="col"><div class="label">Medicamentos</div><div class="value">${this.escapeHtml(p.medicamento || '-')}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="label">Última Evolução</div>
          <div class="value">${ultimaEvolucao ? this.escapeHtml(`${ultimaEvolucao.dataEvolucao || ''} - ${ultimaEvolucao.observacao || ''}`) : '-'}</div>
        </div>
      </div>
    `;
  }

  private templateAnamnese(p: Paciente): string {
    const evolucoes = (p.evolucoes || []).slice().sort((a: any, b: any) => (a.dataEvolucao || '').localeCompare(b.dataEvolucao || '')).reverse();
    return `
      ${this.templateHeader(p, 'Modelo Anamnese')}
      <div class="section">
        <h2>Anamnese e Histórico Clínico</h2>
        <div class="card">
          <div class="label">Queixa / Histórico</div>
          <div class="value">${this.escapeHtml(p.breveDiagnostico || '-')}</div>
        </div>
      </div>
      <div class="section">
        <h2>Evoluções (resumo)</h2>
        ${(evolucoes.length ? evolucoes.map((e: any) => `
          <div class="card">
            <div class="evo-date">${this.escapeHtml(e.dataEvolucao || '')}</div>
            <div class="muted">${this.escapeHtml((e.observacao || '').slice(0, 240))}${(e.observacao && e.observacao.length > 240) ? '...' : ''}</div>
          </div>
        `).join('') : '<div class="muted">Sem evoluções registradas.</div>')}
      </div>
    `;
  }

  private renderAtividades(list: any[] | undefined | null): string {
    const atividades = Array.isArray(list) ? list : [];
    if (!atividades.length) return '';
    const items = atividades.map(a => `
      <div class="card">
        <div class="row">
          <div class="col">
            <div class="label">Atividade</div>
            <div class="value">${this.escapeHtml(a.titulo || '-')}</div>
          </div>
          <div class="col">
            <span class="pill">${this.escapeHtml(this.formatTempo(a.tempo))}</span>
          </div>
        </div>
        ${a.descricao ? `<div class="muted" style="margin-top:6px">${this.escapeHtml(a.descricao)}</div>` : ''}
      </div>
    `).join('');
    return `
      <div class="section" style="margin-top:10px">
        <h3 style="margin-bottom:6px">Atividades</h3>
        <div class="grid-2">${items}</div>
      </div>
    `;
  }

  private renderExercicios(list: any[] | undefined | null): string {
    const exercicios = Array.isArray(list) ? list : [];
    if (!exercicios.length) return '';
    const rows = exercicios.map(x => `
      <tr>
        <td>${this.escapeHtml(x.descricao || '-')}</td>
        <td class="muted">${this.escapeHtml(x.obs || '')}</td>
        <td style="text-align:center">${this.escapeHtml(String(x.series ?? '-'))}</td>
        <td style="text-align:center">${this.escapeHtml(String(x.repeticoes ?? '-'))}</td>
        <td style="text-align:center">${this.escapeHtml(this.formatTempo(x.tempo))}</td>
        <td style="text-align:center">${this.escapeHtml(this.calcCarga(x.series, x.repeticoes))}</td>
      </tr>
    `).join('');
    return `
      <div class="section" style="margin-top:10px">
        <h3 style="margin-bottom:6px">Exercícios</h3>
        <div class="card">
          <table style="width:100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:1px solid var(--line); padding:6px 4px;">Descrição</th>
                <th style="text-align:left; border-bottom:1px solid var(--line); padding:6px 4px;">Obs</th>
                <th style="text-align:center; border-bottom:1px solid var(--line); padding:6px 4px;">Séries</th>
                <th style="text-align:center; border-bottom:1px solid var(--line); padding:6px 4px;">Repetições</th>
                <th style="text-align:center; border-bottom:1px solid var(--line); padding:6px 4px;">Tempo</th>
                <th style="text-align:center; border-bottom:1px solid var(--line); padding:6px 4px;">Carga</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private formatTempo(v: any): string {
    const n = Number(v);
    if (!isFinite(n) || n <= 0) return '—';
    if (n < 60) return `${n} min`;
    const h = Math.floor(n / 60);
    const m = n % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  private calcCarga(series: any, repeticoes: any): string {
    const s = Number(series);
    const r = Number(repeticoes);
    if (!isFinite(s) || !isFinite(r) || s <= 0 || r <= 0) return '—';
    return String(s * r);
  }

  private renderResumoEvolucoes(p: Paciente): string {
    const evolucoes: any[] = Array.isArray(p.evolucoes) ? p.evolucoes : [];
    if (!evolucoes.length) return '';
    const totalAtividades = evolucoes.reduce((acc, e) => acc + (Array.isArray(e.atividades) ? e.atividades.length : 0), 0);
    const totalExercicios = evolucoes.reduce((acc, e) => acc + (Array.isArray(e.exercicios) ? e.exercicios.length : 0), 0);
    return `
      <div class="section">
        <h2>Resumo</h2>
        <div class="grid-3">
          <div class="kpi"><div class="label">Evoluções</div><div class="big">${evolucoes.length}</div></div>
          <div class="kpi"><div class="label">Atividades</div><div class="big">${totalAtividades}</div></div>
          <div class="kpi"><div class="label">Exercícios</div><div class="big">${totalExercicios}</div></div>
        </div>
      </div>
    `;
  }

  private escapeHtml(input: string): string {
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
