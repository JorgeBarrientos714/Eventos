import { IsNotEmpty, IsString, Length } from 'class-validator';

export class IniciarDocenteDto {
  @IsNotEmpty({ message: 'El DNI es obligatorio' })
  @IsString()
  @Length(5, 20, { message: 'El DNI debe tener entre 5 y 20 caracteres' })
  dni: string;
}
