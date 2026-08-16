export interface UserLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserToken {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  claims: Array<{ value: string, type: string }>;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    key: string;
    accessToken: string;
    expiresIn: number;
    userToken: UserToken;
    plano: string;
  };
  error: string;
}

export interface RespostaRecuperacaoSenha {
  sucesso: boolean;
  mensagem?: string;
  erro?: string;
  erros?: string[];
}

export interface DadosRedefinirSenha {
  usuarioId: string;
  token: string;
  novaSenha: string;
  confirmacaoSenha: string;
}
