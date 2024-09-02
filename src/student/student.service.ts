import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateStudentDto, EditStudentDto } from './dto/student.dto';
import { CreateInscriptionDto } from '../inscription/dto/inscription.dto';
import { CreateQualificationDto } from '../qualification/dto/qualification.dto';
import { InscriptionService } from '../inscription/inscription.service';
import { QualificationService } from '../qualification/qualification.service';
//import * as XLSX from 'xlsx';
import { create } from 'domain';


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

    async createStudent(student:CreateStudentDto){
        
        try{
            if (!student.gradeId) {
                throw new HttpException('Se debe llenar una Grado', HttpStatus.BAD_REQUEST);
            }
            const verifyStudent =  await this.prisma.student.findFirst({where:{dni:student.dni}});
            if (!verifyStudent){
                const newStudent = await this.prisma.student.create({data:student})
                return newStudent
        }else{
            throw new HttpException(`Ya existe un estudiante con el numero de DNI:${student.dni}`, HttpStatus.CONFLICT);
        };
        }catch(error){
            throw error;
        }
    };

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


    //async createStudentsFromExcel(file: Express.Multer.File,createStudent:CreateStudentDto,createInscription:CreateInscriptionDto,createQualification:CreateQualificationDto,
    //    inscriptionService:InscriptionService,qualificationService:QualificationService
    //) {
    //    try {
    //        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    //        const sheetName = workbook.SheetNames[0];
    //        const sheet = workbook.Sheets[sheetName];
    //        const studentsData = XLSX.utils.sheet_to_json(sheet);
//
    //        const createdStudents = [];
//
    //        for (const studentData of studentsData) {
    //            const createStudentDto = createStudent;
    //            createStudentDto.name = studentData['Nombre'];
    //            createStudentDto.lastName = studentData['Apellido'];
    //            createStudentDto.secondName = studentData['Segundo Nombre'];
    //            createStudentDto.dni = studentData['DNI'];
    //            createStudentDto.email = studentData['Email'];
    //            createStudentDto.schoolId = studentData['ID Escuela'];
    //            createStudentDto.gradeId = studentData['ID Grado'];
    //            createStudentDto.mode = studentData['Modo'];
//
    //            const student = await this.createStudent(createStudentDto);
    //            createdStudents.push(student);
//
    //            if (studentData['Inscripción']) {
    //                const createInscriptionDto = createInscription;
    //                createInscriptionDto.studentId = student.id;
    //                createInscriptionDto.testId = studentData['ID Prueba'];
    //                createInscriptionDto.ticket = studentData['Ticket'];
    //                createInscriptionDto.quantity = studentData['Cantidad'];
    //                await this.inscriptionService.createInscription(createInscriptionDto);
    //            }
//
    //            if (studentData['Calificación']) {
    //                const createQualificationDto = createQualification;
    //                createQualificationDto.studentId = student.id;
    //                createQualificationDto.testId = studentData['ID Prueba'];
    //                createQualificationDto.score = studentData['Puntaje'];
    //                createQualificationDto.startingTime = studentData['Hora Inicio'];
    //                createQualificationDto.endingTime = studentData['Hora Fin'];
    //                await this.qualificationService.createQualification(createQualificationDto);
    //            }
    //        }
//
    //        return createdStudents;
    //    } catch (error) {
    //        throw new HttpException('Error al procesar el archivo Excel', HttpStatus.INTERNAL_SERVER_ERROR);
    //    }
    //}



}
