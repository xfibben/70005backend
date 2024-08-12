export interface CreateInscriptionDto {
    studentId: number
    contestId?: number
    ticket: string
    quantity: number
}

export interface EditInscriptionDto {
    studentId?: number
    contestId?: number
    ticket?: string
    quantity?: number
}