import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateInscriptionDto, EditInscriptionDto } from './dto/inscription.dto';

@Injectable()
export class InscriptionService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getInscriptions(){
        try{
            const inscriptions = await this.prisma.inscription.findMany();
            return inscriptions;
        }catch(error){
            throw error;
        }
    }

    async getInscription(id:number){
        try{
            const inscription = await this.prisma.inscription.findUnique({where:{id}});
            return inscription;
        }catch(error){
            throw error;
        }
    }

    async createInscription(inscription: CreateInscriptionDto){
        try{
            const newInscription = await this.prisma.inscription.create({data:inscription})
            return newInscription;
        }catch(error){
            throw error;
        }
    }

    async editInscription(id: number, inscription: EditInscriptionDto){
        try{
            const editInscription = await this.prisma.inscription.update({where:{id},data:inscription})
            return editInscription;
        }catch(error){
            throw error;
        }
    }

    async deleteInscription(id:number){
        try{
            const deleteInscription = await this.prisma.inscription.delete({where:{id}});
            return deleteInscription;
        }catch(error){
            throw error;
        }
    }

}
