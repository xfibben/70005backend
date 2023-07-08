import { Module } from '@nestjs/common';
import { ConcursoService } from './concurso.service';
import { ConcursoController } from './concurso.controller';

@Module({
  providers: [ConcursoService],
  controllers: [ConcursoController]
})
export class ConcursoModule {}
