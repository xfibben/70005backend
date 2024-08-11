export interface CreateStudentDto{
    name: string
    lastName: string
    email: string
    dni: string
    schoolId: number
    owned:boolean
    gradeId: number
}

export interface EditStudentDto{
    name?: string
    lastName?: string
    email?: string
    dni?:string
    schoolId?: number
    owned?:boolean
    gradeId?: number
}