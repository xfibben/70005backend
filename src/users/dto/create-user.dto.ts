import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    username:string
    @ApiProperty({type:'string'})

    password:string
}
