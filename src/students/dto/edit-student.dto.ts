import {ApiProperty,} from "@nestjs/swagger";


export class EditStudentDto{
    @ApiProperty({type:String})
    dni?:string
    @ApiProperty({type:String})
    nombres?:string
    @ApiProperty({type:String})
    apellidos?:string
    @ApiProperty({type:Number})
    colegioId?:number
    @ApiProperty({type:Number})
    precio?:number
    @ApiProperty({type:Boolean})
    pagado?:boolean

}