import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [UsersModule, StudentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
