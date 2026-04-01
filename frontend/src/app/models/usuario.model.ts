export type Rol = 'Administrador' | 'Empleado';

export interface Usuario {
    _id: string;
    nombre: string;
    email: string;
    rol: Rol;
    fechaCreacion: Date;
    activo?: boolean;
}

export interface UsuarioForm {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}