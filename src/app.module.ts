import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, StudentModule, SchoolModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
