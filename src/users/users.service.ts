import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}
  async create(createUserDto: CreateUserDto) {
    const userFound=await this.prisma.user.findUnique({where:{username:createUserDto.username}});
    if(userFound){
      throw new HttpException('el nombre de usuario ya existe',505);
    }else{
      return this.prisma.user.create({data:createUserDto})
    }
  }

  async findAll() {
    const users=await this.prisma.user.findMany()
    if(users.length==0){
      throw new HttpException('no existen usuarios',505);
    }else{
      return users;
    }
  }

  async findOne(username:string) {
    const userFound=await this.prisma.user.findUnique({where:{username:username}});
    if(userFound){
      return userFound;
    }else{
      throw new HttpException(`no existe el usuario ${username} `,404);
    }
  }
  

  async update(username:string, updateUserDto: UpdateUserDto) {
    const userFound=await this.prisma.user.findUnique({where:{username:username}});
    if(!userFound){
      throw new HttpException('no existe el usuario',404);
    }else{
      return this.prisma.user.update({where:{username:username},data:updateUserDto})
      
    }
  }

  remove(username:string) {
    return this.prisma.user.delete({where:{username:username}})
  }
}
