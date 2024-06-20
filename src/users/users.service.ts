import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto,EditUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    getUsers(): Promise<CreateUserDto[]> {
        return this.prisma.user.findMany();
    };

    async createUser(user:CreateUserDto) {
        const verifyUser =  await this.prisma.user.findFirst({where:{username:user.username}});
        if (!verifyUser){
            const newUser = await this.prisma.user.create({data:user})
            return newUser
        }else{
            return 'No se puede duplicar el usuario'
        };
    };

    async editUser(user:EditUserDto){
        const verifyUser =  await this.prisma.user.findUnique({where:{username:user.username}});
        if (verifyUser){
            const newUser = await this.prisma.user.update({where:{username:user.username}, data:user})
            return newUser
        }else{
            return 'No se encontro el usuario'
        };
    };
}
