import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateStudentDto} from "./dto/create-student.dto";
import {CreateColegioDto} from "./dto/create-colegio.dto";

@Injectable()
export class StudentsService {
    constructor(private prisma:PrismaService) {}

    async createStudent(student:CreateStudentDto){
        const studentFound=await this.prisma.student.findFirst({where:{dni:student.dni}})

        if(studentFound){
            throw new HttpException('Ya existe ese usuario',HttpStatus.CONFLICT);
        }

        const newStudent=await this.prisma.student.create({data:student})

        return newStudent


    }

    async createColegio(colegio:CreateColegioDto){
        const foundColegio=await this.prisma.colegio.findFirst({where:{name:colegio.name}});

        if(foundColegio){
            throw new HttpException('El colegio ya existe',HttpStatus.CONFLICT);
        }

        const newColegio=await this.prisma.colegio.create({data:colegio});

        return newColegio


    }
}
