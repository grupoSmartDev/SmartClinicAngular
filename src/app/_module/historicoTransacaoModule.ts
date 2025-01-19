import { Banco } from "./bancoModule";
import { Usuario } from "./usuarioModule";

export interface HistoricoTransacao{
    id: number;
    bancoId: number;
    banco: Banco;
    dataTransacao: Date;
    tipoTransacao: string;
    valor: number;
    descricao: string;
    referencia: string;
    usuarioId?: number;
    usuario?: Usuario;
  }