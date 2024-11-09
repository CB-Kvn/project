export interface LoginDTO {
  codUsuario: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  name?: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ResponseLogin {
  IdUsuario: number;
  IdEmpresa: number;
  CodUsuario: string;
  Nombres: string;
  Apellidos: string;
  Correo_Electronico?: string;
  RolId?: number;
  AreaId?: number;
  EmpleadoId?: number;
  Intentos_Fallidos?: number;
  Bloqueado?: boolean;
  Sesion_Iniciada?: boolean;
  Multiple_Sesion?: boolean;
  Contrasena_Caduca?: boolean;
  Fecha_Creacion?: Date;
  Fecha_Modifica?: Date;
  Estado?: boolean;
}

export interface RegisterUsuarioDTO {
  IdEmpresa: number;
  CodUsuario: string;
  Nombres: string;
  Apellidos: string;
  Contrasena: string;
  Correo_Electronico?: string;
  RolId?: number;
  AreaId?: number;
  Autenticacion?: boolean;
  EmpleadoId?: number;
  Intentos_Fallidos?: number;
  Bloqueado?: boolean;
  Sesion_Iniciada?: boolean;
  Multiple_Sesion?: boolean;
  Cambiar_Password_Logon?: boolean;
  Contrasena_Caduca?: boolean;
  Version_Sistema?: number;
  Fecha_Contrasena?: Date;
  Usuario_Creacion?: string;
  Fecha_Creacion?: Date;
  Equipo_Creacion?: string;
  Usuario_Modifica?: string;
  Fecha_Modifica?: Date;
  Equipo_Modifica?: string;
  Estado?: boolean;
}

export interface Usuario extends RegisterUsuarioDTO {
  IdUsuario?: number;
} 