import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTestDto, EditTestDto } from './dto/test.dto';

@Injectable()
export class TestService {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getTests(){
        try{
            const tests = await this.prisma.test.findMany();
            return tests;
        }catch(error){
            throw error;
        }
    };

    async getTest(id:number){
        try{
            const test = await this.prisma.test.findUnique({where:{id}})
            return test;
        }catch(error){
            throw error;
        }
    };

    async createTest(test: CreateTestDto ){
        try{
            const newTest = await this.prisma.test.create({data:test});
            return newTest;
        }catch(error){
            throw error;
        }
    };

    async editTest(id:number, test:EditTestDto){
        try{
            const updatedTest = await this.prisma.test.update({where:{id},data:test});
            return updatedTest;
        }catch(error){
            throw error;
        }
    };

    async deleteTest(id:number){
        try{
            const findedTest = await this.prisma.test.findFirst({where:{id}})
            if (findedTest){
                return await this.prisma.test.delete({where:{id}})
            }else{
                throw new HttpException("No se encontro una prueba con id ${id}", HttpStatus.NOT_FOUND)
            }
        }catch(error){
            throw error;
        }
    };


}
