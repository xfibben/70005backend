import {Controller, Post, Get, Patch, Delete, Body} from '@nestjs/common';
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {StudentsService} from "./students.service";
import {CreateStudentDto} from "./dto/create-student.dto";

@ApiBearerAuth()
@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentService:StudentsService) {}

    @Post()
    createStudent(@Body() student:CreateStudentDto){
        return this.studentService.createStudent(student);
    }



}
