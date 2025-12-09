export interface AlterarDadosUsuario {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}