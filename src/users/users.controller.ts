import { Controller, Get, Post, Put, Delete, Body} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService) {}

    @Get('/')
    getUsers(){
        return this.usersService.getUsers();
    }

    @Post('/')
    createUser(@Body() user:any){
        return this.usersService.createUser(user);
    }
}
