import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarnetizacionService } from './carnetizacion.service';
import { CreateCarnetizacionDto } from './dto/create-carnetizacion.dto';
import { UpdateCarnetizacionDto } from './dto/update-carnetizacion.dto';

@Controller('carnetizacion')
export class CarnetizacionController {
  constructor(private readonly carnetizacionService: CarnetizacionService) {}

  @Post()
  create(@Body() createCarnetizacionDto: CreateCarnetizacionDto) {
    return this.carnetizacionService.create(createCarnetizacionDto);
  }

  @Get()
  findAll() {
    return this.carnetizacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carnetizacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarnetizacionDto: UpdateCarnetizacionDto) {
    return this.carnetizacionService.update(+id, updateCarnetizacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carnetizacionService.remove(+id);
  }
}
