import { Module } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { InscriptionController } from './inscription.controller';

@Module({
  providers: [InscriptionService],
  controllers: [InscriptionController]
})
export class InscriptionModule {}
