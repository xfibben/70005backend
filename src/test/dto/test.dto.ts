export interface CreateTestDto{
    name : string
    time? : string
    date : string
    gradeId : number
    contestId : number
}

export interface EditTestDto{
    name? : string
    time? : string
    date? : string
    gradeId? : number
    contestId? : number
}