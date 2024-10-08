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

    async getQualificationsByTest(testId: number) {
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
                },
                where: { testId },
                orderBy: [
                    {
                        student: {
                            lastName: 'asc'
                        }
                    },
                    {
                        student: {
                            secondName: 'asc'
                        }
                    },
                    {
                        student: {
                            name: 'asc'
                        }
                    }
                ]
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

    async createQualification(qualification: CreateQualificationDto) {
        try {
            const isQualification = await this.prisma.qualification.findFirst({
                where: { studentId: qualification.studentId, testId: qualification.testId },
            });

            if (isQualification) {
                throw new HttpException('Qualification for this student already exists.', HttpStatus.CONFLICT);
            }

            // Obtener el `time` del `Test` relacionado
            const relatedTest = await this.prisma.test.findUnique({
                where: { id: qualification.testId },
                select: { time: true },
            });

            if (!relatedTest) {
                throw new HttpException('Related test not found.', HttpStatus.NOT_FOUND);
            }

            // Asegurar que `startingTime` sea igual al `time` del `Test`
            qualification.startingTime = relatedTest.time;

            const duration = this.calculateDuration(qualification.startingTime, qualification.endingTime);

            const newQualification = await this.prisma.qualification.create({
                data: {
                    ...qualification,
                    time: duration,
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

    async deleteQualification(id: number) {
        try {
            // Primero, encuentra la calificación para obtener los IDs del estudiante y del test
            const qualification = await this.prisma.qualification.findUnique({
                where: { id },
                select: {
                    studentId: true,
                    testId: true,
                },
            });
    
            if (!qualification) {
                throw new Error('Calificación no encontrada');
            }
    
            // Elimina la inscripción relacionada
            await this.prisma.inscription.deleteMany({
                where: {
                    studentId: qualification.studentId,
                    testId: qualification.testId,
                },
            });
    
            // Luego, elimina la calificación
            const deletedQualification = await this.prisma.qualification.delete({ where: { id } });
            return deletedQualification;
        } catch (error) {
            throw error;
        }
    }


}
