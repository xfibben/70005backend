import { Module } from '@nestjs/common';
import { QualificationController } from './qualification.controller';
import { QualificationService } from './qualification.service';

@Module({
    providers:[QualificationService],
    controllers: [QualificationController]
})
export class QualificationModule {}
