import {type} from '@prisma/client';

export interface CreateSchoolDto{
    name:string
    address?:string
    email?:string
    phone?:string
    type:type
    gradeId:number
}

export interface EditSchoolDto{
    name?:string
    addressn?:string
    email?:string
    phone?:string
    type?:type
    gradeId?:number
}