import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {AuthGuard} from './auth.guard';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }
  @Post('login')
  loginUser(@Body() createUserDto:CreateUserDto){
    return this.usersService.loginUser(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':username')
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(username, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':username')
  remove(@Param('username') username:string) {
    return this.usersService.remove(username);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Headers('Authorization') authorization:string){
    const token = authorization.replace('Bearer ', '');
    await this.usersService.logout(token)
    return { message: 'Logout exitoso' };
  }
}
