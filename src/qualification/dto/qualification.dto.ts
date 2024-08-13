export interface CreateQualificationDto{
    studentId: number
    testId: number
    score: number
    startingTime: string
    endingTime: string
    time:string
}

export interface EditQualificationDto{
    studentId?: number
    testId?: number
    score?: number
    startingTime?:string
    endingTime?:string
    time?:string
}