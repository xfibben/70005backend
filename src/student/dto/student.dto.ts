import { mode } from "@prisma/client"

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