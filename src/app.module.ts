import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { ContestModule } from './contest/contest.module';
import { QualificationService } from './qualification/qualification.service';
import { QualificationModule } from './qualification/qualification.module';
import { GradeModule } from './grade/grade.module';

@Module({
  imports: [UsersModule, StudentModule, SchoolModule, AuthModule, TestModule, ContestModule, QualificationModule, GradeModule],
  controllers: [],
  providers: [QualificationService],
})
export class AppModule {}
