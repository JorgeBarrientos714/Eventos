import { Module } from '@nestjs/common';
import { CarnetizacionService } from './carnetizacion.service';
import { CarnetizacionController } from './carnetizacion.controller';

@Module({
  controllers: [CarnetizacionController],
  providers: [CarnetizacionService],
})
export class CarnetizacionModule {}
