import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateStudentDto} from "./dto/create-student.dto";

import {EditStudentDto} from "./dto/edit-student.dto";

@Injectable()
export class StudentsService {
    constructor(private prisma:PrismaService) {}

    async createStudent(student:CreateStudentDto){
        const studentFound=await this.prisma.student.findFirst({where:{dni:student.dni}})

        const colegio=await this.prisma.colegio.findFirst({where:{id:student.colegioId}});



        if(studentFound){
            throw new HttpException('Ya existe ese usuario',HttpStatus.CONFLICT);
        }
        if(!colegio){
            throw new HttpException('El colegio no existe',HttpStatus.CONFLICT)
        }

        const newStudent=await this.prisma.student.create({data:student})

        return newStudent


    }

    async getStudents(){
        const students=await this.prisma.student.findMany();

        return students;

    }

    async getStudent(dni:string){
        const student=await this.prisma.student.findUnique({where:{dni:dni},include:{colegio:true}});

        if(!student){
            throw new HttpException('El usuario no existe',HttpStatus.NOT_FOUND);
        }
        return student;
    }

    async editStudent(dni:string,student:EditStudentDto){
        const foundStudent=await this.prisma.student.findFirst({where:{dni:student.dni}});

        if(!foundStudent){
            throw new HttpException('El usuario no existe',HttpStatus.NOT_FOUND);
        }
        const editStudent=await this.prisma.student.update({where:{dni:dni},data:student})

        return editStudent;

    }

    async deleteStudent(dni:string){
        const foundStudent=await this.prisma.student.findFirst({where:{dni:dni}});
        if(!foundStudent){
            throw new HttpException('El estudiante no existe',HttpStatus.NOT_FOUND);
        }
        const deleteStudent=await this.prisma.student.delete({where:{dni:dni}});

        return deleteStudent;
    }

  

    
}
