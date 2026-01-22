import { Test, TestingModule } from '@nestjs/testing';
import { CarnetizacionController } from './carnetizacion.controller';
import { CarnetizacionService } from './carnetizacion.service';

describe('CarnetizacionController', () => {
  let controller: CarnetizacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarnetizacionController],
      providers: [CarnetizacionService],
    }).compile();

    controller = module.get<CarnetizacionController>(CarnetizacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
