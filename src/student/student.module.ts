import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { QualificationService } from 'src/qualification/qualification.service';
import { InscriptionService } from 'src/inscription/inscription.service';

@Module({
  providers: [StudentService,QualificationService,InscriptionService],
  controllers: [StudentController]
})
export class StudentModule {}
