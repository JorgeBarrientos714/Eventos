import { PartialType } from '@nestjs/mapped-types';
import { CreateCarnetizacionDto } from './create-carnetizacion.dto';

export class UpdateCarnetizacionDto extends PartialType(CreateCarnetizacionDto) {}
