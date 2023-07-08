import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';

import { StudentsModule } from './students/students.module';
import { ColegioModule } from './colegio/colegio.module';
import { ConcursoModule } from './concurso/concurso.module';
import { PruebaModule } from './prueba/prueba.module';

@Module({
  imports: [
    UsersModule,
    StudentsModule,
    ColegioModule,
    ConcursoModule,
    PruebaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
