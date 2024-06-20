import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStudentDto, EditStudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    getStudents(){
        return this.prisma.student.findMany();
    };

    async createStudent(student:CreateStudentDto){
        const verifyStudent =  await this.prisma.student.findFirst({where:{email:student.email}});
        if (!verifyStudent){
            const newStudent = await this.prisma.student.create({data:student})
            return newStudent
        }else{
            return 'No se puede duplicar el estudiante'
        };
    };

    async editStudent(student:EditStudentDto){
        const verifyStudent =  await this.prisma.student.findFirst({where:{email:student.email}});
        if (!verifyStudent){
            const newStudent = await this.prisma.student.update({where:{dni:student.dni}, data:student})
            return newStudent
        }else{
            return 'No se puede duplicar el estudiante'
        };
    }

}
