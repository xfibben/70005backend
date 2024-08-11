import { level, grade} from "@prisma/client"

export interface CreateGradeDto {
    level: level
    grade: grade
}

export interface EditGradeDto {
    level?: level
    grade?: grade
}