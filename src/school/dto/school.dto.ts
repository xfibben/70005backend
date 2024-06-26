export interface CreateSchoolDto{
    name:string
    addres:string
    email:string
    phone:string
}

export interface EditSchoolDto{
    name?:string
    addres?:string
    email?:string
    phone?:string
}