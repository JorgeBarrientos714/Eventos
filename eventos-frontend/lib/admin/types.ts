export type AdminEventState = 'activo' | 'pospuesto' | 'cancelado';

export interface AdminArea {
  id: string;
  nombre: string;
  imagen?: string;
}

export interface AdminEvent {
  id: string;
  nombre: string;
  descripcion: string;
  regional: string;
  areaId: string;
  areaNombre: string;
  terapiaOClase: 'terapia' | 'clase';
  diasSemana: string[];
  departamento: string;
  municipio: string;
  direccion: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  cuposDisponibles: number;
  cuposTotales: number;
  imagen?: string;
  estado: AdminEventState;
}

export type AdminDocenteGenero = 'Masculino' | 'Femenino' | 'Otro';

export interface AdminDocente {
  dni: string;
  nombre: string;
  telefono: string;
  genero: AdminDocenteGenero;
  fechaNacimiento: string;
  discapacidad: 'si' | 'no';
  detalleDiscapacidad?: string;
  municipio: string;
  grupoEtnico: string;
}

export interface AdminRegistro {
  id: string;
  eventoId: string;
  dni: string;
  fechaRegistro: string;
}

export interface AdminEmpleadoSummary {
  id: number;
  nombre: string;
  numeroEmpleado: string;
  dni: string;
  idArea: number;
  areaNombre?: string;
}

export interface AdminUsuarioSummary {
  id: number;
  correoElectronico: string;
  empleado?: AdminEmpleadoSummary;
}

export interface AdminLoginPayload {
  correoElectronico: string;
  contrasena: string;
}

export interface AdminRegisterPayload {
  nombre: string;
  numeroEmpleado: string;
  dni: string;
  idArea: number;
  correoElectronico: string;
  contrasena: string;
}

export interface AdminRecoveryPayload {
  correoElectronico: string;
}

export interface AdminResetPasswordPayload {
  token: string;
  nuevaContrasena: string;
}

export interface AdminUserSession {
  usuario: AdminUsuarioSummary;
  eventos: AdminEvent[];
}
