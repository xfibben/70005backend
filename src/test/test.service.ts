import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TestService {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    getTests(){
        try{
            const tests = this.prisma.test.findMany();
            return tests;
        }catch(error){
            throw error;
        }
    };

    getTest(id:number){
        try{
            const test = this.prisma.test.findUnique({where:{id}})
        }catch(error){
            throw error;
        }
    };

    


}
