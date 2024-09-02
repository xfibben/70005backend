import { mode } from "@prisma/client"
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface CreateStudentDto{
    name: string
    lastName: string
    secondName: string
    email: string
    dni: string
    schoolId: number
    mode:mode
    gradeId: number
}

export interface EditStudentDto{
    name?: string
    lastName?: string
    secondName? : string
    email?: string
    dni?:string
    schoolId?: number
    mode?:mode
    gradeId?: number
}

export class UploadExcelDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    file: any;
}