import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRegistroEventoDto {
    @IsNumber()
    @IsNotEmpty()
    idEvento: number;

    @IsNumber()
    @IsNotEmpty()
    idDocente: number;

    @IsNumber()
    @IsNotEmpty()
    idEstado: number;

    @IsNumber()
    @IsOptional()
    cantidadInvDocente?: number;
}
