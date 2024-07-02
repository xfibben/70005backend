import { level } from "@prisma/client"

export interface CreateGradeDto {
    grade: number
    level: level
}

export interface EditGradeDto {
    grade?: number
    level?: level
}