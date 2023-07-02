import { HttpException, Injectable,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {hash,compare} from 'bcrypt';
import {JwtService} from '@nestjs/jwt'
import {find} from "rxjs";

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService,private jwtService:JwtService){}
  async registerUser(createUserDto: CreateUserDto) {
    const {username,password}=createUserDto;
    const plainToHash=await hash(password,10);
    createUserDto={...createUserDto,password:plainToHash};
    return this.prisma.user.create({data:createUserDto})

  }

  async loginUser(createUserDto:CreateUserDto){
    const {username,password}=createUserDto
    const userFound=await this.prisma.user.findUnique({where:{username: username}})
    if(!userFound){
      throw new HttpException('Usuario no encontrado',404)
    }
    const checkPassword= await compare(password,userFound.password);

    if(!checkPassword){
      throw new HttpException('Contraseña incorrecta',403);
    }
    const payload = {id:userFound.id,username:userFound.username}
    const token=await this.jwtService.sign(payload)
    const data={
      user:userFound,
      token
    }
    return data







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
      throw new HttpException(`no existe el usuario ${username} `,HttpStatus.NOT_FOUND);
    }
  }
  

  async update(username:string, updateUserDto: UpdateUserDto) {
    const userFound=await this.prisma.user.findUnique({where:{username:username}});
    if(!userFound){
      throw new HttpException('no existe el usuario',HttpStatus.FORBIDDEN);
    }else{
      return this.prisma.user.update({where:{username:username},data:updateUserDto})
      
    }
  }

  remove(username:string) {
    return this.prisma.user.delete({where:{username:username}})
  }
}
