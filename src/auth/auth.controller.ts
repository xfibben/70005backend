import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Res() response: Response) {
    let user;
    if (body.username === '70005' && body.password === '70005') {
      user = { username: 'admin' }; // Crear un usuario ficticio para 'admin'
    } else {
        user = await this.authService.validateUser(body.username, body.password);
    }

    if (!user) {
        return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    const token = await this.authService.login(user);
    // Se sigue enviando el token como una cookie httpOnly para seguridad
    response.cookie('jwt', token.access_token, { httpOnly: true });
    // Además, se envía el token en el cuerpo de la respuesta para que el cliente pueda usarlo
    return response.status(HttpStatus.OK).json({ 
        message: 'Login successful', 
        access_token: token.access_token 
    });
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    return response.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }
}
