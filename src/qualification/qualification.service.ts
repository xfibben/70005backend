import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateQualificationDto, EditQualificationDto } from './dto/qualification.dto';

@Injectable()
export class QualificationService {

    private prisma:PrismaClient;

    constructor(){this.prisma = new PrismaClient();}

    async getQualifications() {
    try {
        const qualifications = await this.prisma.qualification.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                test: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return qualifications;
    } catch (error) {
        throw error;
    }
}

    async getQualification(id:number){
        try {
            const qualification = await this.prisma.qualification.findUnique({where:{id}});
            return qualification;
        } catch (error) {
            throw error;
        }
    };

    async createQualification(qualification:CreateQualificationDto){
        try {
            const newQualification = await this.prisma.qualification.create({data:qualification})
            return newQualification;
        } catch (error) {
            throw error;
        }
    };

    async editQualification(id:number, qualification:EditQualificationDto){
        try {
            const findedQualification = await this.prisma.qualification.findFirst({where:{id}});
            if (findedQualification){
                return await this.prisma.qualification.update({where:{id}, data:qualification})
            }else{
                throw new HttpException('No se encontro una calificacion con id %{id}', HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteQualification(id:number){
        try {
            const deletedQualification = await this.prisma.qualification.delete({where:{id}});
            return deletedQualification;
        } catch (error) {
            throw error;
        }
    };

}
