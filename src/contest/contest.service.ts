import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateContestDto, EditContestDto } from './dto/contest.dto';

@Injectable()
export class ContestService {
    private prisma:PrismaClient;

    constructor()
    {this.prisma = new PrismaClient();}l

    async getContests(){
        try{
            return await this.prisma.contest.findMany();
        }catch(error){
            throw error;
        }
    };

    async getContest(id:number){
        try{
            const contest= await this.prisma.contest.findUnique({where:{id}})
            return contest;
        }catch(error){
            throw error;
        }
    };

    async createContest(contest:CreateContestDto){
        try{
            const newContest = await this.prisma.contest.create({data:contest});
            return newContest;
        }catch(error){
            throw error;
        }
    }

    async editContest(id:number, contest:EditContestDto){
        try{
            const updatedContest = await this.prisma.contest.update({where:{id},data:contest})
            return updatedContest;
        }catch(error){
            throw error;
        }
    }

    async deleteContest(id:number){
        try{
            return await this.prisma.contest.delete({where:{id}})
        }catch(error){
            throw error;
        }
    }


}
