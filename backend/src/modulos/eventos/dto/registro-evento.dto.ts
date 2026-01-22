/**
 * DTOs para registro de docentes a eventos
 * Módulo: eventos
 * Función: Tipado de datos para búsqueda y registro de docentes
 */

export class BuscarDocentePorDniRegistroDto {
  nIdentificacion: string;
}

export class RegistroEventoDocenteDto {
  docenteId: number;
  eventoId: number;
  
  // Datos opcionales a actualizar del docente
  primerNombre?: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  genero?: 'M' | 'F' | 'O';
  fechaNacimiento?: Date;
  telefono1?: string;
  direccionResidencia?: string;
  idDepartamento?: number;
  idMunicipioResidencia?: number;
  idAldea?: number;
  idGrupoEtnico?: number;
}

export class DocenteRegistroResponseDto {
  id: number;
  nIdentificacion: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreCompleto: string;
  genero: 'M' | 'F' | 'O';
  fechaNacimiento: Date;
  telefono1: string;
  direccionResidencia?: string;
  
  // Ubicación
  idDepartamento?: number;
  departamento?: {
    id: number;
    nombre: string;
  };
  idMunicipioResidencia?: number;
  municipio?: {
    id: number;
    nombre: string;
  };
  idAldea?: number;
  aldea?: {
    id: number;
    nombre: string;
  };
  
  // Grupo Étnico
  idGrupoEtnico?: number;
  grupoEtnico?: {
    id: number;
    nombreGrupoEtnico: string;
  };
}
