import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateQualificationDto, EditQualificationDto } from './dto/qualification.dto';

@Injectable()
export class QualificationService {

    private prisma:PrismaClient;

    constructor(){this.prisma = new PrismaClient();}

    calculateDuration(start: string, end: string): string {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);

        let totalStartMinutes = startHour * 60 + startMinute;
        let totalEndMinutes = endHour * 60 + endMinute;

        // Si el tiempo final es menor que el de inicio, asumimos que el tiempo final es al día siguiente
        if (totalEndMinutes < totalStartMinutes) {
          totalEndMinutes += 24 * 60;
        }

        const durationMinutes = totalEndMinutes - totalStartMinutes;
        const durationHours = Math.floor(durationMinutes / 60);
        const durationRemainMinutes = durationMinutes % 60;

        // Retorna en formato "HH:MM"
        return `${String(durationHours).padStart(2, '0')}:${String(durationRemainMinutes).padStart(2, '0')}`;
    }

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
    };

    async getQualificationsByTest(testId:number){ {
        try {
            const qualifications = await this.prisma.qualification.findMany({
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            dni: true,
                            lastName: true
                        }
                    },
                    test: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },where:{testId}
            });
            return qualifications;
        } catch (error) {
            throw error;
        }
    };
    }

    async getQualification(id:number){
        try {
            const qualification = await this.prisma.qualification.findUnique({where:{id}});
            return qualification;
        } catch (error) {
            throw error;
        }
    };

    async createQualification(qualification: CreateQualificationDto) {
        try {
            const isQualification = await this.prisma.qualification.findFirst({
                where: { studentId: qualification.studentId },
            });

            if (isQualification) {
                throw new HttpException('Qualification for this student already exists.',HttpStatus.CONFLICT);
            }

            const duration = this.calculateDuration(qualification.startingTime, qualification.endingTime);

            const newQualification = await this.prisma.qualification.create({
                data: {
                    ...qualification,
                    time:duration
                },
            });

            return newQualification;
        } catch (error) {
            throw error;
        }
    }

    async editQualification(id:number, qualification:EditQualificationDto){
        try {
            const findedQualification = await this.prisma.qualification.findFirst({where:{id}});
            if (findedQualification){
                const duration = this.calculateDuration(qualification.startingTime, qualification.endingTime);

                return await this.prisma.qualification.update({where:{id}, data:{...qualification,time:duration}})
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
