import { level } from "@prisma/client"

export interface CreateGradeDto {
    level: level
}

export interface EditGradeDto {
    level?: level
}