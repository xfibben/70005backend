import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTestDto, EditTestDto } from './dto/test.dto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';

interface RankingResult {
    time: string;
    score: number;
    dni: string;
    lastName: string;
    secondName: string;
    name: string;
    grade: string;
    level: string;
    schoolName: string;
    mode: string;
    ticket: string;
    quantity: number;
    gradeId: number;
}

@Injectable()
export class TestService {

    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    };

    async getTests(){
        try{
            const tests = await this.prisma.test.findMany(
                {
                    include:{
                        contest:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            );
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

    async exportRankingbyTest(testId: number, res: Response) {
        try {
            const result: RankingResult[] = await this.prisma.$queryRaw<RankingResult[]>`
                SELECT q."time", q."score", s."dni", s."lastName", s."secondName", s."name", q."score", q."time", g."level", g."grade", g.id as "gradeId", sc.name as "schoolName", s.mode, i.ticket, i.quantity 
                FROM "Test" t
                LEFT JOIN "Qualification" q ON t.id = q."testId"
                LEFT JOIN "Student" s ON q."studentId" = s.id
                LEFT JOIN "School" sc ON s."schoolId" = sc.id
                LEFT JOIN "Grade" g ON g.id = t."gradeId"
                LEFT JOIN "Contest" c ON t."contestId" = c.id
                LEFT JOIN "Inscription" i ON i."testId" = t.id
                WHERE t.id = ${testId}
                ORDER BY g.id ASC, q.score DESC, q.time ASC;`;

            // Crear un nuevo libro de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ranking');

            // Agregar encabezados
            worksheet.columns = [
                { header: 'Marca Temporal', key: 'time', width: 15 },
                { header: 'Puntuación', key: 'score', width: 10 },
                { header: 'DNI', key: 'dni', width: 15 },
                { header: 'Apellido Paterno', key: 'lastName', width: 20 },
                { header: 'Apellido Materno', key: 'secondName', width: 20 },
                { header: 'Nombre', key: 'name', width: 20 },
                { header: 'Grado', key: 'grade', width: 15 },
                { header: 'Nivel', key: 'level', width: 15 },
                { header: 'Procedencia', key: 'schoolName', width: 25 },
                { header: 'Modalidad', key: 'mode', width: 15 },
                { header: 'Número de Recibo', key: 'ticket', width: 20 },
                { header: 'Monto', key: 'quantity', width: 15 },
            ];

            let previousGradeId = null;

            // Agregar filas al Excel
            result.forEach((row) => {
                if (previousGradeId !== null && previousGradeId !== row.gradeId) {
                    worksheet.addRow([]); // Insertar una fila vacía como salto de línea
                }
                worksheet.addRow({
                    time: row.time,
                    score: row.score,
                    dni: row.dni,
                    lastName: row.lastName,
                    secondName: row.secondName,
                    name: row.name,
                    grade: row.grade,
                    level: row.level,
                    schoolName: row.schoolName,
                    mode: row.mode,
                    ticket: row.ticket,
                    quantity: row.quantity
                });
                previousGradeId = row.gradeId;
            });

            // Exportar el archivo Excel
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=ranking.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            throw error;
        }
    }

}
