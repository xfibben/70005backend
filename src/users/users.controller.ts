import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getUsers(){
        return this.usersService.getUsers();
    }

    @Get('/:username')
    getUser(@Param('username') username:string){
        return this.usersService.getUser(username);
    }

    @Post('/')
    createUser(@Body() user:any){
        return this.usersService.createUser(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:username')
    editUser(@Param('username') username:string, @Body() user:any){
        user.username = username;
        return this.usersService.editUser(username ,user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:username')
    deleteUser(@Param('username') username:string){
        return this.usersService.deleteUser(username);
    }
}


