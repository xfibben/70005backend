import {ApiProperty} from "@nestjs/swagger";

export class CreateColegioDto{

    @ApiProperty({type:String,uniqueItems:true})
    name:string
}