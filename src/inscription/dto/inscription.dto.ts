export interface CreateInscriptionDto {
    studentId: number
    testId: number
    ticket: string
    quantity: number
}

export interface EditInscriptionDto {
    studentId?: number
    testId?: number
    ticket?: string
    quantity?: number
}