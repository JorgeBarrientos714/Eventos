import { Test, TestingModule } from '@nestjs/testing';
import { CarnetizacionService } from './carnetizacion.service';

describe('CarnetizacionService', () => {
  let service: CarnetizacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarnetizacionService],
    }).compile();

    service = module.get<CarnetizacionService>(CarnetizacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
