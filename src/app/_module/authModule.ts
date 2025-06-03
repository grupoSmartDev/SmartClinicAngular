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
  };
  error: string;
}