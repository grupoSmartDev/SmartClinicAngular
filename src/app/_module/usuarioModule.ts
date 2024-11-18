export interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  dataNascimento?: Date;
  perfil?: string;
  cpf? : string;
  ativo : boolean;
  profissionalId? : number; 
}
