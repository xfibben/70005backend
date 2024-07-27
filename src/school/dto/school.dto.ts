import {type} from '@prisma/client';

export interface CreateSchoolDto{
    name:string
    address?:string
    email?:string
    phone?:string
    type:type
}

export interface EditSchoolDto{
    name?:string
    address?:string
    email?:string
    phone?:string
    type?:type
}