import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStudentDto, EditStudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getStudents(){
        return await this.prisma.student.findMany();
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
        const verifyStudent =  await this.prisma.student.findFirst({where:{dni:student.dni}});
        if (!verifyStudent){
            const newStudent = await this.prisma.student.create({data:student})
            return newStudent
        }else{
            return 'No se puede duplicar el estudiante'
        };
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
