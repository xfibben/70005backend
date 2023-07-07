import {Controller, Post, Get, Patch, Delete, Body, Param,UseGuards, ParseIntPipe} from '@nestjs/common';
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {StudentsService} from "./students.service";
import {CreateStudentDto} from "./dto/create-student.dto";
import {EditStudentDto} from "./dto/edit-student.dto";
import { AuthGuard } from 'src/users/auth.guard';

@ApiBearerAuth()
@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentService:StudentsService) {}

    @UseGuards(AuthGuard)
    @Post()
    createStudent(@Body() student:CreateStudentDto){
        return this.studentService.createStudent(student);
    }
    @UseGuards(AuthGuard)
    @Get()
    getStudents(){
        return this.studentService.getStudents();
    }
    @UseGuards(AuthGuard)
    @Get(':dni')
    getStudent(@Param('dni') dni:string){
        return this.studentService.getStudent(dni);
    }
    @UseGuards(AuthGuard)
    @Patch(':dni')
    editStudent(@Param('dni') dni:string,@Body() student:EditStudentDto){
        return this.studentService.editStudent(dni, student);
    }
    @UseGuards(AuthGuard)
    @Delete(':dni')
    deleteStudent(@Param('dni') dni:string){
        return this.studentService.deleteStudent(dni);
    }

   


}
