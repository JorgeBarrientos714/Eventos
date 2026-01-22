import { IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InvitadoDto } from './inscripcion-evento.dto';

export class AgregarInvitadosDto {
  @IsNotEmpty({ message: 'El ID del evento es obligatorio' })
  @IsNumber()
  idEvento: number;

  @IsNotEmpty({ message: 'El ID del docente es obligatorio' })
  @IsNumber()
  idDocente: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitadoDto)
  invitados: InvitadoDto[];
}
