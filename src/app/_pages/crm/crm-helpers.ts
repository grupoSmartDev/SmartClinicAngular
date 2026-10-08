import { CANAL_BADGE } from '../../_module/crmModule';

export class CrmHelpers {

  // Link wa.me — só dígitos, com DDI 55 (sem duplicar se o número já vier com 55 + DDD)
  static whatsappLink(telefone?: string | null): string {
    const digitos = (telefone || '').replace(/\D/g, '');
    if (!digitos) return '';
    const comDdi = digitos.length >= 12 && digitos.startsWith('55') ? digitos : `55${digitos}`;
    return `https://wa.me/${comDdi}`;
  }

  static badgeCanal(canal?: string | null): string {
    return CANAL_BADGE[canal || ''] || 'bg-secondary';
  }

  // Timestamps vêm do backend em UTC ("...Z"). Converte para Date local antes do pipe datePtBr
  // (o pipe lê os campos do texto como estão, o que mostraria a hora em UTC).
  // Datas sem hora (YYYY-MM-DD) passam direto, sem conversão de fuso.
  static paraLocal(valor?: string | null): Date | string | undefined {
    if (!valor) return undefined;
    if (/Z$|[+-]\d{2}:\d{2}$/.test(valor)) {
      const d = new Date(valor);
      return isNaN(d.getTime()) ? valor : d;
    }
    return valor;
  }

  // Cor de texto legível sobre um fundo hex
  static corTexto(hex?: string | null): string {
    const h = (hex || '').replace('#', '');
    if (h.length !== 6) return '#fff';
    const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#212529' : '#fff';
  }
}
