import { Module } from '@nestjs/common';
import { ColegioService } from './colegio.service';
import { ColegioController } from './colegio.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [ColegioService],
  controllers: [ColegioController]
})
export class ColegioModule {}
