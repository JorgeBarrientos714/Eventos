import { Injectable } from '@nestjs/common';
import { CreateCarnetizacionDto } from './dto/create-carnetizacion.dto';
import { UpdateCarnetizacionDto } from './dto/update-carnetizacion.dto';

@Injectable()
export class CarnetizacionService {
  create(createCarnetizacionDto: CreateCarnetizacionDto) {
    return 'This action adds a new carnetizacion';
  }

  findAll() {
    return `This action returns all carnetizacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carnetizacion`;
  }

  update(id: number, updateCarnetizacionDto: UpdateCarnetizacionDto) {
    return `This action updates a #${id} carnetizacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} carnetizacion`;
  }
}
