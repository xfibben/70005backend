import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateStudentDto} from "./dto/create-student.dto";

@Injectable()
export class StudentsService {
    constructor(private prisma:PrismaService) {}

    async createStudent(student:CreateStudentDto){
        const studentFound=await this.prisma.student.findUnique({where:{dni:student.dni}})

        if(studentFound){
            throw new HttpException('Ya existe ese usuario',HttpStatus.CONFLICT);
        }

        const newStudent=await this.prisma.student.create({data:student})

        return newStudent


    }
}
