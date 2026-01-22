import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class CancelarInscripcionDto {
  @IsOptional()
  @IsInt()
  idRegistro?: number;

  @ValidateIf((o) => !o.idRegistro)
  @IsInt()
  idEvento?: number;
}
