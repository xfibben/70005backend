import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateContestDto, EditContestDto } from './dto/contest.dto';
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

    

    async exportRankingbyContest(id: number, res: Response) {
    try {
        const result: RankingResult[] = await this.prisma.$queryRaw<RankingResult[]>`
            SELECT q."time", q."score", s."dni", s."lastName", s."secondName", s."name", q."score", q."time", g."level", g."grade", g.id as "gradeId", sc.name as "schoolName", s.mode, i.ticket, i.quantity 
            FROM "Test" t
            LEFT JOIN "Qualification" q ON t.id = q."testId"
            LEFT JOIN "Student" s ON q."studentId" = s.id
            LEFT JOIN "School" sc ON s."schoolId" = sc.id
            LEFT JOIN "Grade" g ON g.id = t."gradeId"
            LEFT JOIN "Contest" c ON t."contestId" = c.id
            LEFT JOIN "Inscription" i ON i."studentId" = s.id
            WHERE c.id = ${id}
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
