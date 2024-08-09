import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateGradeDto, EditGradeDto } from './dto/grade.dto';

@Injectable()
export class GradeService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getGrades(){
        try{
            const grades = await this.prisma.grade.findMany();
            return grades;
        }catch(error){
            throw error;
        }
    };

    async getGrade(id:number){
        try{
            const grade = await this.prisma.grade.findUnique({where:{id}})
            return grade;
        }catch(error){
            throw error;
        }
    };

    async createGrade(level: CreateGradeDto){
        try{
            const newGrade = await this.prisma.grade.create({data:level});
            return newGrade;
        }catch(error){
            throw error;
        }
    };

    async editGrade(id:number, grade: EditGradeDto){
        try{
            const updatedGrade = await this.prisma.grade.update({where:{id},data:grade});
            return updatedGrade;
        }catch(error){
            throw error;
        }
    };

    async deleteGrade(id:number){
        try{
            const findedGrade = await this.prisma.grade.findFirst({where:{id}})
            if (findedGrade){
                return await this.prisma.grade.delete({where:{id}})
            }else{
                throw new Error("No se encontro una calificacion con id ${id}")
            }
        }catch(error){
            throw error;
        }
    };


}
