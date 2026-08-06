export class DateHelper {

  // Converte string 'YYYY-MM-DD' para Date sem shift de timezone
  static parseDateLocal(dateStr: string | Date): Date | null {
    if (!dateStr) return null;
    // Alguns módulos tipam o campo como Date, mas o valor real vindo da API é string.
    const str = typeof dateStr === 'string' ? dateStr : DateHelper.formatDateLocal(dateStr);
    if (!str) return null;
    const [year, month, day] = str.substring(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Formata Date para 'YYYY-MM-DD' sem converter para UTC
  static formatDateLocal(date: Date): string | null {
    if (!date) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Para enviar ao backend — data clínica sem hora (sem toISOString)
  static toBackendDate(date: Date | string): string | null {
    if (!date) return null;
    if (typeof date === 'string') return date.substring(0, 10);
    return DateHelper.formatDateLocal(date);
  }

  // Para exibir no template — formato brasileiro
  static toBrazilian(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? DateHelper.parseDateLocal(date.substring(0, 10)) : date;
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
}
