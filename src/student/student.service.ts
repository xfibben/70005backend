import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStudentDto, EditStudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getStudents() {
  return await this.prisma.student.findMany({
    include: {
      school: {
        select: {
          name: true // Asume que el modelo de 'school' tiene un campo 'name'
        }
      },
      grade: {
        select: {
          grade: true,
          level: true // Asume que el modelo de 'grade' tiene un campo 'name'
        }
      }
    }
  });
};

    async getStudent(id:number){
        try{
            return await this.prisma.student.findUnique({
                where:{id}
            })
        }catch(error){
            throw error;
        }
    };

    async createStudent(student:CreateStudentDto){
        try{
            const verifyStudent =  await this.prisma.student.findFirst({where:{dni:student.dni}});
        if (!verifyStudent){
            const newStudent = await this.prisma.student.create({data:student})
            return newStudent
        }else{
            throw new HttpException(`Ya existe un estudiante con el numero de DNI:${student.dni}`, HttpStatus.CONFLICT);
        };
        }catch(error){
            throw error;
        }
    };

    async editStudent(id:number ,student:EditStudentDto){
        try{
            const studentFound = await this.prisma.student.update({
                where:{id},
                data:student
            })
            return studentFound;
        }catch(error){
            throw error;
        }
    }

    async deleteStudent(id:number){
        try{
            const studentFound = await this.prisma.student.delete({
                where:{id}
            })
            return studentFound;
        }catch(error){
            throw error;
        }
    }

}
