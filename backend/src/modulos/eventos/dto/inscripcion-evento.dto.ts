import { IsNotEmpty, IsNumber, IsString, IsArray, IsBoolean, IsOptional, ValidateNested, ArrayMaxSize, Length, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class InvitadoDto {
  @IsNotEmpty({ message: 'El DNI del invitado es obligatorio' })
  @IsString()
  @Length(5, 20, { message: 'El DNI debe tener entre 5 y 20 caracteres' })
  dniInvitado: string;

  @IsNotEmpty({ message: 'El nombre del invitado es obligatorio' })
  @IsString()
  @Length(3, 200, { message: 'El nombre debe tener entre 3 y 200 caracteres' })
  nombreInvitado: string;
}

export class InscripcionEventoDto {
  @IsNotEmpty({ message: 'El ID del evento es obligatorio' })
  @IsNumber()
  idEvento: number;

  @IsNotEmpty({ message: 'El ID del docente es obligatorio' })
  @IsNumber()
  idDocente: number;

  // Discapacidades
  @IsBoolean()
  tieneDiscapacidad: boolean;

  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada ID de discapacidad debe ser un número' })
  @IsOptional()
  idsDiscapacidades?: number[];

  // Invitados
  @IsBoolean()
  llevaInvitados: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitadoDto)
  @IsOptional()
  invitados?: InvitadoDto[];
}

export class InscripcionResponseDto {
  idRegistro: number;
  mensaje: string;
  cuposRestantes: number;
  cantidadInvitados: number;
  discapacidadesRegistradas: number;
}
