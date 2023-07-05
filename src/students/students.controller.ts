import {Controller, Post, Get, Patch, Delete, Body, Param} from '@nestjs/common';
import {ApiBearerAuth,ApiTags} from "@nestjs/swagger";
import {StudentsService} from "./students.service";
import {CreateStudentDto} from "./dto/create-student.dto";
import {CreateColegioDto} from "./dto/create-colegio.dto";
import {EditStudentDto} from "./dto/edit-student.dto";

@ApiBearerAuth()
@ApiTags('students')
@Controller('students')
export class StudentsController {
    constructor(private readonly studentService:StudentsService) {}

    @Post()
    createStudent(@Body() student:CreateStudentDto){
        return this.studentService.createStudent(student);
    }
    @Get()
    getStudents(){
        return this.studentService.getStudents();
    }

    @Get(':dni')
    getStudent(@Param('dni') dni:string){
        return this.studentService.getStudent(dni);
    }

    @Patch(':dni')
    editStudent(@Param('dni') dni:string,@Body() student:EditStudentDto){
        return this.studentService.editStudent(dni, student);
    }

    @Delete(':dni')
    deleteStudent(@Param('dni') dni:string){
        return this.studentService.deleteStudent(dni);
    }

    //colegio
    @ApiTags('colegio')
    @Post('colegio')
    createColegio(@Body() colegio:CreateColegioDto){
        return this.studentService.createColegio(colegio);
    }



}
