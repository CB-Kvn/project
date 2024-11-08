export interface LoginDTO {
  email: string;
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
  idUsuario: number,
  idEmpresa: number,
  codUsuario: string,
  nombres: string,
  apellidos: string,
  correo_Electronico: string | null,
  rolId: number | null,
  areaId: number | null,
  empleadoId: number | null,
  intentos_Fallidos: bigint | null,
  bloqueado: bigint | null,
  sesion_Iniciada: bigint | null,
  multiple_Sesion: bigint | null,
  contrasena_Caduca: bigint | null,
  fecha_Creacion: Date | null,
  fecha_Modifica: Date | null,
  estado: bigint | null
}