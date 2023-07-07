import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus,HttpException } from '@nestjs/common';
import { CreateColegioDto, UpdateColegioDto } from './dto/create-colegio.dto';

@Injectable()
export class ColegioService {
    constructor(private prisma:PrismaService){}

    async createColegio(colegio:CreateColegioDto){
        const foundColegio=await this.prisma.colegio.findFirst({where:{name:colegio.name}});

        if(foundColegio){
            throw new HttpException('El colegio ya existe',HttpStatus.CONFLICT);
        }

        const newColegio=await this.prisma.colegio.create({data:colegio});

        return newColegio


    }

    async getColegios(){
        const colegios=await this.prisma.colegio.findMany();
        return colegios;
    }

    async getColegio(id:number){
        const colegio=await this.prisma.colegio.findUnique({where:{id:id},include:{students:true}});
        if(!colegio){
            throw new HttpException('El colegio no existe',HttpStatus.NOT_FOUND);
        }

        return colegio
    }

    async updateColegio(id:number,data:UpdateColegioDto){
        const foundColegio=await this.prisma.colegio.findFirst({where:{id:id}});
        const repeatColegio=await this.prisma.colegio.findFirst({where:{name:data.name}})

        if(!foundColegio){
            throw new HttpException('El colegio no existe',HttpStatus.NOT_FOUND);
        }
        if(repeatColegio){
            throw new HttpException('El nombre ya existe',HttpStatus.CONFLICT)
        }

        const updatedColegio=await this.prisma.colegio.update({where:{id:id},data:data});
        return updatedColegio;
    }

    

    async deleteColegio(id:number){
        const foundColegio=await this.prisma.colegio.findUnique({where:{id:id}})

        if(!foundColegio){
            throw new HttpException('No existe el colegio',HttpStatus.NOT_FOUND);
        }

        
        const deleteColegio=await this.prisma.colegio.delete({where:{id:id}});
        return deleteColegio;
    }
}
