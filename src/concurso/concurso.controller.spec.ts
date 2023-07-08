import { Test, TestingModule } from '@nestjs/testing';
import { ConcursoController } from './concurso.controller';

describe('ConcursoController', () => {
  let controller: ConcursoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcursoController],
    }).compile();

    controller = module.get<ConcursoController>(ConcursoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
