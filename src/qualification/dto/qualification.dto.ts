export interface CreateQualificationDto{
    studentId: number
    testId: number
    score: number
    time:number
}

export interface EditQualificationDto{
    studentId?: number
    testId?: number
    score?: number
    time?:number
}