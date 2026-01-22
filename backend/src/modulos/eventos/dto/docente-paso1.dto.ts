import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

/**
 * DTO para búsqueda de docente por DNI
 */
export class BuscarDocentePorDniDto {
  @IsString()
  dni: string; // N_IDENTIFICACION
}

/**
 * DTO para actualizar datos personales del docente (paso 1 carnetización)
 */
export class ActualizarDocentePaso1Dto {
  @IsOptional()
  @IsString()
  primerNombre?: string; // PRIMER_NOMBRE

  @IsOptional()
  @IsString()
  segundoNombre?: string; // SEGUNDO_NOMBRE

  @IsOptional()
  @IsString()
  tercerNombre?: string; // TERCER_NOMBRE

  @IsOptional()
  @IsString()
  primerApellido?: string; // PRIMER_APELLIDO

  @IsOptional()
  @IsString()
  segundoApellido?: string; // SEGUNDO_APELLIDO

  @IsOptional()
  @IsString()
  genero?: string; // GENERO (M/F/Otro)

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string; // FECHA_NACIMIENTO

  @IsOptional()
  @IsString()
  telefono1?: string; // TELEFONO_1

  @IsOptional()
  @IsNumber()
  idMunicipio?: number; // ID_MUNICIPIO (ubicación)

  @IsOptional()
  @IsNumber()
  idAldea?: number; // ID_ALDEA (opcional, ubicación)

  @IsOptional()
  @IsString()
  direccionResidencia?: string; // DIRECCION_RESIDENCIA

  @IsOptional()
  @IsNumber()
  idGrupoEtnico?: number; // ID_GRUPO_ETNICO
}

/**
 * DTO de respuesta: docente precargado
 */
export class DocenteResponseDto {
  id: number;
  nIdentificacion: string; // DNI (solo lectura)
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  genero?: string;
  fechaNacimiento?: Date;
  telefono1?: string;
  direccionResidencia?: string;
  idMunicipio?: number;
  idAldea?: number;
  idGrupoEtnico?: number;
  municipio?: { id: number; nombres: string };
  aldea?: { id: number; nombreAldea: string };
  grupoEtnico?: { id: number; nombre: string };
}
