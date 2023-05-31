import { HttpException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {

  constructor( private prisma:PrismaService){}
  async create(createStudentDto: CreateStudentDto) {
   const newStudent=await this.prisma.student.findUnique({where:{dni:createStudentDto.dni}});
   if(newStudent){
    throw new HttpException('ya existe un usuario con ese dni ',505)
   }else{
    return this.prisma.student.create({data:createStudentDto})
   }
  }

  async findAll() {
    const student=await this.prisma.student.findMany();
    if(student.length==0){
      throw new HttpException('todavia no hay estudiantes registrados',505);
    }else{
      return student;
    }
  }

  async findOne(id: number) {
    const student=await this.prisma.student.findUnique({where:{id:id}})
    if(student){
      return student;
    }else{
      throw new HttpException('no existe el estudiante',404);
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student=await this.prisma.student.findUnique({where:{id:id}})
    if(student){
      return this.prisma.student.update({where:{id},data:updateStudentDto});
    }else{
      throw new HttpException('no existe el estudiante',404);
    }
  }

  async remove(id: number) {
    const student=await this.prisma.student.findUnique({where:{id:id}})
    if(student){
      return this.prisma.student.delete({where:{id:id}})
    }else{
      throw new HttpException('no existe el estudiante',404);
    }
  }
}
