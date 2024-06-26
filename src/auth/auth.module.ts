import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secretKey', // Usa una clave más segura y guárdala en variables de entorno
      signOptions: { expiresIn: '60s' },
    }),
  ],
    providers: [AuthService, JwtStrategy, UsersService],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}