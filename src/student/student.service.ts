import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client'; // Import Prisma error types

import { CreateStudentDto, EditStudentDto } from './dto/student.dto';
import { CreateInscriptionDto } from '../inscription/dto/inscription.dto';
import { CreateQualificationDto } from '../qualification/dto/qualification.dto';
import { InscriptionService } from '../inscription/inscription.service';
import { QualificationService } from '../qualification/qualification.service';
import * as XLSX from 'xlsx';
import { create } from 'domain';
import { Express } from 'express';
import { Request } from 'express';
import { Multer } from 'multer';




@Injectable()
export class StudentService {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getStudents() {
  return await this.prisma.student.findMany({
    include: {
      school: {
        select: {
          name: true // Asume que el modelo de 'school' tiene un campo 'name'
        }
      },
      grade: {
        select: {
          level: true ,
          grade: true// Asume que el modelo de 'grade' tiene un campo 'name'
        }
      }
    }
  });
};

    async getStudent(id:number){
        try{
            return await this.prisma.student.findUnique({
                where:{id}
            })
        }catch(error){
            throw error;
        }
    };

    async createStudent(student: CreateStudentDto) {
        try {
            if (!student.gradeId || !student.schoolId) {
                throw new HttpException('Se debe llenar un Grado y Escuela', HttpStatus.BAD_REQUEST);
            }

            // Check if the school exists
            const verifySchool = await this.prisma.school.findUnique({
                where: { id: student.schoolId },
            });

            if (!verifySchool) {
                throw new HttpException(`La escuela con ID ${student.schoolId} no existe`, HttpStatus.BAD_REQUEST);
            }

            // Check if a student with the same DNI already exists
            const existingStudent = await this.prisma.student.findUnique({
                where: { dni: student.dni },
            });

            if (existingStudent) {
                throw new HttpException(`El DNI ${student.dni} ya está registrado para otro estudiante.`, HttpStatus.CONFLICT);
            }

            // Create the new student
            const newStudent = await this.prisma.student.create({ data: student });
            return newStudent;

        } catch (error) {
            throw error;
        }
    }



    async editStudent(id: number, student: EditStudentDto) {
        try {
            
    
            const studentFound = await this.prisma.student.update({
                where: { id },
                data: student
            });
    
            return studentFound;
        } catch (error) {
            throw error;
        }
    }


    async deleteStudent(id: number) {
    try {
        await this.prisma.$transaction(async (prisma) => {
            // Primero, elimina todas las calificaciones relacionadas con el estudiante
            await prisma.qualification.deleteMany({
                where: { studentId: id }
            });

            // Luego, elimina todas las inscripciones relacionadas con el estudiante
            await prisma.inscription.deleteMany({
                where: { studentId: id }
            });

            // Finalmente, elimina el estudiante
            const studentFound = await prisma.student.delete({
                where: { id }
            });

            return studentFound;
        });
    } catch (error) {
        throw new HttpException('Error al eliminar el estudiante y sus relaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


async createStudentsFromExcel(
    file: Express.Multer.File,
    gradeId: number,
    schoolId: number,
    testId: number,
    createStudent: CreateStudentDto | null = null
) {
    try {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const studentsData = XLSX.utils.sheet_to_json(sheet);

        const createdStudents = [];
        const validModes = ['INDEPENDIENTE', 'DELEGACION', 'INTERNO', 'EXTERNO'];


        // Start Prisma transaction to handle rollback on failure
        await this.prisma.$transaction(async (prisma) => {
            for (const studentData of studentsData) {
                // If createStudent is null, create a new instance of CreateStudentDto
                const createStudentDto: CreateStudentDto = createStudent ? { ...createStudent } : {} as CreateStudentDto;

                try {
                    // Set student data from Excel
                    createStudentDto.name = studentData['NOMBRES'];
                    createStudentDto.lastName = studentData['APELLIDO PATERNO'];
                    createStudentDto.secondName = studentData['APELLIDO MATERNO'];
                    createStudentDto.dni = studentData['N° DE DNI'] ? String(studentData['N° DE DNI']) : null;
                    createStudentDto.email = studentData['Email'];
                    createStudentDto.gradeId = gradeId;
                    createStudentDto.schoolId = schoolId;
                    const modalidad = studentData['MODALIDAD'];
                    createStudentDto.mode = validModes.includes(modalidad) ? modalidad : 'INTERNO';

                    // Check if a student with the same DNI already exists
                    const existingStudent = await prisma.student.findUnique({
                        where: { dni: createStudentDto.dni },
                    });

                    if (existingStudent) {
                        throw new HttpException(
                            `El DNI ${createStudentDto.dni} ya está registrado para otro estudiante.`,
                            HttpStatus.CONFLICT
                        );
                    }

                    // Create the student in the database
                    const student = await prisma.student.create({ data: createStudentDto });
                    createdStudents.push(student);

                    // Create Qualification
                    const createQualification: CreateQualificationDto = {
                        studentId: student.id,
                        testId: testId,
                        score: null,
                        time: null,
                        startingTime: studentData['Hora Inicio'] || '',
                        endingTime: studentData['Hora Fin'] || '',
                    };
                    await prisma.qualification.create({ data: createQualification });

                    // Create Inscription
                    const createInscriptionDto: CreateInscriptionDto = {
                        studentId: student.id,
                        testId: testId,
                        ticket: studentData['TICKET'] ? String(studentData['TICKET']) : null,
                        quantity: studentData['CANTIDAD'],
                    };
                    await prisma.inscription.create({ data: createInscriptionDto });

                } catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        // Handle Prisma unique constraint violation error (e.g., for DNI)
                        if (error.code === 'P2002') {
                            throw new HttpException(
                                `Error: El DNI ${createStudentDto.dni} ya está registrado para otro estudiante.`,
                                HttpStatus.CONFLICT
                            );
                        }
                    }
                    // Catch any other errors and rollback
                    throw new HttpException({
                        message: `Error while processing student ${studentData['NOMBRES']} ${studentData['APELLIDO PATERNO']}`,
                        details: error.message
                    }, HttpStatus.BAD_REQUEST);
                }
            }
        });

        return createdStudents;

    } catch (error) {
        console.error('Error while processing Excel file:', error);

        // Catch and throw the final error
        throw new HttpException({
            message: 'Error al procesar el archivo Excel. Se cancelaron todas las creaciones.',
            details: error.response ? error.response.message : error.message
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}







}
