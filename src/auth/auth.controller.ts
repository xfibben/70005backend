import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Res() response: Response) {
    const user = await this.authService.validateUser(body.username, body.password);
    console.log(user);
    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized xd' });
    }
    const token = await this.authService.login(user);
    response.cookie('jwt', token.access_token, { httpOnly: true });
    return response.status(HttpStatus.OK).json({ message: 'Login successful' });
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
