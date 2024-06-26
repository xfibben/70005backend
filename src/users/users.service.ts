import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto,EditUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    getUsers(): Promise<CreateUserDto[]> {
        try{
            return this.prisma.user.findMany();
        }catch(error){
            throw error;
        }
    };

    async getUser(username:string){
        try{
            return await this.prisma.user.findUnique({
                where:{username}
            })
        }catch(error){
            throw error;
        }
    };

    async createUser(user:CreateUserDto) {
        try{
            const verifyUser =  await this.prisma.user.findFirst({where:{username:user.username}});
        if (!verifyUser){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            const newUser = await this.prisma.user.create({data:user})
            return newUser
        }else{
            return 'No se puede duplicar el usuario'
        };
        }catch(error){
            throw error;
        }
    };

    async editUser(username:string, user:EditUserDto){
        try{
            const updatedUser = await this.prisma.user.update({
                where:{username},
                data:user
            })
            return updatedUser;
        }catch(error){
            throw error;
        }
    };
}
