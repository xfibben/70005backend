export interface CreateUserDto{
    username: string
    email: string
    name: string
    password: string
}

export interface EditUserDto{
    username?: string
    email?:string
    name?:string
    password?:string
}