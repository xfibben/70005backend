import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateSchoolDto, EditSchoolDto } from './dto/school.dto';

@Injectable()
export class SchoolService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getSchools(){
        try{
            return await this.prisma.school.findMany()
        }catch(error){
            throw error;
        }
    };

    async getSchool(id:number){
        try{
            return await this.prisma.school.findUnique({where:{id:id}})
        }catch(error){
            throw error;
        }
    };

    async createSchool(school:CreateSchoolDto){
        try{
            return await this.prisma.school.create({data:school})
        }catch(error){
            throw error;
        }
    };

    async deleteSchool(id:number){
        try{
            return await this.prisma.school.delete({where:{id:id}})
        }catch(error){
            throw error;
        }
    };

    async updateSchool(id:number, school:EditSchoolDto){
        try{
            return await this.prisma.school.update({where:{id:id}, data:school})
        }catch(error){
            throw error;
        }
    };
}
