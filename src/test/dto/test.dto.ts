export interface CreateTestDto{
    name : string
    time? : number
    date : string
    gradeId : number
    contestId : number
}

export interface EditTestDto{
    name? : string
    time? : number
    date? : string
    gradeId? : number
    contestId? : number
}