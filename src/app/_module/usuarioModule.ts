export interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
  senha?: string;
  celular?: string;
  dataNascimento?: Date;
  perfil?: string;
  cpf? : string;
  ativo : boolean;
  profissionalId? : number; 
}
