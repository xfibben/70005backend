import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./jwtConstants";

@Module({
  imports:[PrismaModule,
  JwtModule.register({
    secret:jwtConstants,
    signOptions:{expiresIn:'10m'},
    global:true
  })],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
