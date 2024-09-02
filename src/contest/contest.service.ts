import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateContestDto, EditContestDto } from './dto/contest.dto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
const PDFDocument = require('pdfkit'); // Importación como CommonJS
import Table from 'pdfkit-table';


import { HttpException,HttpStatus } from '@nestjs/common';


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

    async deleteContest(id: number) {
        try {
            const findedContest = await this.prisma.contest.findFirst({ where: { id } });

            if (findedContest) {
                // Buscar todas las pruebas (tests) asociadas a este concurso
                const tests = await this.prisma.test.findMany({
                    where: { contestId: id },
                });

                // Para cada test, eliminar las calificaciones y las inscripciones asociadas
                for (const test of tests) {
                    await this.prisma.qualification.deleteMany({
                        where: { testId: test.id },
                    });

                    await this.prisma.inscription.deleteMany({
                        where: { testId: test.id },
                    });

                    // Eliminar el test después de eliminar sus dependencias
                    await this.prisma.test.delete({
                        where: { id: test.id },
                    });
                }

                // Ahora eliminar el concurso
                return await this.prisma.contest.delete({ where: { id } });
            } else {
                throw new HttpException(`No se encontró un concurso con id ${id}`, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error;
        }
    }

    async exportRankingbyContest(id: number, res: Response) {
        try {
            const result: RankingResult[] = await this.prisma.$queryRaw<RankingResult[]>`
                SELECT DISTINCT
                    q."time",
                    q."score",
                    s."dni",
                    s."lastName",
                    s."secondName",
                    s."name",
                    g."level",
                    g."grade",
                    g.id as "gradeId",
                    sc.name as "schoolName",
                    s.mode,
                    COALESCE(i."ticket", '') as "ticket",
                    COALESCE(i."quantity", 0) as "quantity"
                FROM "Test" t
                 JOIN "Qualification" q ON t.id = q."testId"
                 JOIN "Student" s ON q."studentId" = s.id
                 JOIN "School" sc ON s."schoolId" = sc.id
                 JOIN "Grade" g ON g.id = t."gradeId"
                 JOIN "Contest" c ON t."contestId" = c.id
                 JOIN (
                    SELECT DISTINCT 
                        i."studentId",
                        i."ticket",
                        i."quantity"
                    FROM "Inscription" i
                ) i ON i."studentId" = s.id
                WHERE c.id = ${id}
                ORDER BY g.id ASC, q.score DESC, q.time ASC;
`;

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

    async exportRankingbyContestOrderByName(id: number, res: Response) {
        try {
            const result: RankingResult[] = await this.prisma.$queryRaw<RankingResult[]>`
                SELECT DISTINCT
                    q."time",
                    q."score",
                    s."dni",
                    s."lastName",
                    s."secondName",
                    s."name",
                    g."level",
                    g."grade",
                    g.id as "gradeId",
                    sc.name as "schoolName",
                    s.mode,
                    COALESCE(i."ticket", '') as "ticket",
                    COALESCE(i."quantity", 0) as "quantity"
                FROM "Test" t
                 JOIN "Qualification" q ON t.id = q."testId"
                 JOIN "Student" s ON q."studentId" = s.id
                 JOIN "School" sc ON s."schoolId" = sc.id
                 JOIN "Grade" g ON g.id = t."gradeId"
                 JOIN "Contest" c ON t."contestId" = c.id
                 JOIN (
                    SELECT DISTINCT 
                        i."studentId",
                        i."ticket",
                        i."quantity"
                    FROM "Inscription" i
                ) i ON i."studentId" = s.id
                WHERE c.id = ${id}
                ORDER BY g.id ASC, s."lastName" ASC, s."secondName" ASC, s."name" ASC;
`;

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

    async exportRankingbyContestPDF(id: number, res: Response) {
        try {
            // Obtener el nombre del concurso
            const contest = await this.prisma.contest.findUnique({
                where: { id: id },
                select: { name: true }
            });

            const result: RankingResult[] = await this.prisma.$queryRaw<RankingResult[]>`
                SELECT DISTINCT
                    q."time",
                    q."score",
                    s."dni",
                    s."lastName",
                    s."secondName",
                    s."name",
                    g."level",
                    g."grade",
                    g.id as "gradeId",
                    sc.name as "schoolName",
                    s.mode,
                    COALESCE(i."ticket", '') as "ticket",
                    COALESCE(i."quantity", 0) as "quantity"
                FROM "Test" t
                 JOIN "Qualification" q ON t.id = q."testId"
                 JOIN "Student" s ON q."studentId" = s.id
                 JOIN "School" sc ON s."schoolId" = sc.id
                 JOIN "Grade" g ON g.id = t."gradeId"
                 JOIN "Contest" c ON t."contestId" = c.id
                 JOIN (
                    SELECT DISTINCT 
                        i."studentId",
                        i."ticket",
                        i."quantity"
                    FROM "Inscription" i
                ) i ON i."studentId" = s.id
                WHERE c.id = ${id}
                ORDER BY g.id ASC, q.score DESC, q.time ASC;`;

            const doc = new PDFDocument();
            const margin = 50;
            const tableTop = 150; // Ajustado para dejar espacio para el título
            const baseRowHeight = 15;
            const rowsPerPage = 30;
            const columnWidths = [30, 100, 100, 100, 100, 60, 60];
            let currentY = tableTop;

            // Título del documento
            doc.fontSize(16).font('Helvetica-Bold').text(`Ranking - ${contest.name}`, { align: 'center' });
            doc.moveDown();

            // Función para calcular la altura necesaria para una fila en función del texto más largo en la fila
            const calculateRowHeight = (row: string[]) => {
                let maxHeight = baseRowHeight;
                doc.fontSize(8); // Reducimos el tamaño de la fuente para evitar saltos de línea innecesarios
                row.forEach((text, index) => {
                    const textHeight = doc.heightOfString(text, { width: columnWidths[index] - 10, align: 'left' });
                    maxHeight = Math.max(maxHeight, textHeight + 10);
                });
                return maxHeight;
            };

            // Función para dibujar la tabla con bordes y ajustar el tamaño de la fila según el contenido
            const drawTableRow = (row: string[], y: number, rowHeight: number) => {
                let x = margin;
                doc.rect(x, y, columnWidths[0], rowHeight).stroke();
                doc.text(row[0], x + 5, y + 5, { width: columnWidths[0] - 10, align: 'left' });

                x += columnWidths[0];
                doc.rect(x, y, columnWidths[1], rowHeight).stroke();
                doc.text(row[1], x + 5, y + 5, { width: columnWidths[1] - 10, align: 'left' });

                x += columnWidths[1];
                doc.rect(x, y, columnWidths[2], rowHeight).stroke();
                doc.text(row[2], x + 5, y + 5, { width: columnWidths[2] - 10, align: 'left' });

                x += columnWidths[2];
                doc.rect(x, y, columnWidths[3], rowHeight).stroke();
                doc.text(row[3], x + 5, y + 5, { width: columnWidths[3] - 10, align: 'left' });

                x += columnWidths[3];
                doc.rect(x, y, columnWidths[4], rowHeight).stroke();
                doc.text(row[4], x + 5, y + 5, { width: columnWidths[4] - 10, align: 'left' });

                x += columnWidths[4];
                doc.rect(x, y, columnWidths[5], rowHeight).stroke();
                doc.text(row[5], x + 5, y + 5, { width: columnWidths[5] - 10, align: 'left' });

                x += columnWidths[5];
                doc.rect(x, y, columnWidths[6], rowHeight).stroke();
                doc.text(row[6], x + 5, y + 5, { width: columnWidths[6] - 10, align: 'left' });
            };

            // Dibujar encabezados
            drawTableRow(['N', 'Apellido Paterno', 'Apellido Materno', 'Nombre', 'Procedencia', 'Puntaje', 'Tiempo'], currentY, baseRowHeight);

            currentY += baseRowHeight;

            // Dibujar filas y manejar paginación
            result.forEach((row, index) => {
                const rowHeight = calculateRowHeight([
                    (index + 1).toString(),
                    row.lastName,
                    row.secondName,
                    row.name,
                    row.schoolName,
                    row.score.toString(),
                    row.time,
                ]);

                if (currentY + rowHeight > doc.page.height - margin) {
                    doc.addPage();
                    currentY = tableTop;
                    // Redibujar encabezados en cada nueva página
                    drawTableRow(['N', 'Apellido Paterno', 'Apellido Materno', 'Nombre', 'Procedencia', 'Puntaje', 'Tiempo'], currentY, baseRowHeight);
                    currentY += baseRowHeight;
                }

                drawTableRow([
                    (index + 1).toString(),
                    row.lastName,
                    row.secondName,
                    row.name,
                    row.schoolName,
                    row.score.toString(),
                    row.time,
                ], currentY, rowHeight);

                currentY += rowHeight;
            });

            // Exportar el archivo PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=ranking-${contest.name}.pdf`);
            doc.pipe(res);
            doc.end();
        } catch (error) {
            throw error;
        }
    }

}





