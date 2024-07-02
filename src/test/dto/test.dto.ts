export interface CreateTestDto{
    name : string
    time? : number
    date : Date
    gradeId : number
    contestId : number
}

export interface EditTestDto{
    name? : string
    time? : number
    date? : Date
    gradeId? : number
    contestId? : number
}