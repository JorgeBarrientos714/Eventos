import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoDto } from './create-evento.dto';

export class UpdateEventoDto extends PartialType(CreateEventoDto) { }

// DTO específico para actualizar docentes
export class UpdateDocenteDto {
    identificacion?: string;
    nombres?: string;
    apellidos?: string;
    telefono?: string;
    genero?: string;
    fecha_nacimiento?: any; // Permitir string o Date
    id_municipio?: number;
    idGrupoEtnico?: number;
    asistio?: string; // 'SI' | 'NO'
    penalizado?: string; // 'SI' | 'NO'
    discapacidadesIds?: number[];
}

// DTO para crear eventos (SIN transformadores)
export class CreateEventoFullDto {
    nombreEvento: string;
    descripcion?: string;
    tipoEvento?: string; // 'CLASE' | 'EVENTO'
    idClase?: number;
    diasSemana?: string;
    idMunicipio?: number;
    direccion?: string;
    fechaInicio: any; // Permitir string o Date
    fechaFin: any; // Permitir string o Date
    horaInicio: string;
    horaFin: string;
    cuposDisponibles?: number;
    cuposTotales?: number;
    imagenBase64?: string;
    idUsuario?: number;
    idRegional?: number;
    cantidadInvPermitidos?: number;
}

// DTO para actualizar eventos (SIN transformadores)
export class UpdateEventoFullDto {
    nombreEvento?: string;
    descripcion?: string;
    tipoEvento?: string;
    idClase?: number;
    diasSemana?: string;
    idMunicipio?: number;
    direccion?: string;
    fechaInicio?: any; // Permitir string o Date
    fechaFin?: any; // Permitir string o Date
    horaInicio?: string;
    horaFin?: string;
    cuposDisponibles?: number;
    cuposTotales?: number;
    imagenBase64?: string;
    idUsuario?: number;
    idRegional?: number;
    cantidadInvPermitidos?: number;
}
