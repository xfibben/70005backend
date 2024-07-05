import { Controller, Put,Param, Body, Get , Post, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('student')
export class StudentController {

    constructor(private readonly studentService:StudentService) {}


    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getStudents(){
        return this.studentService.getStudents();
    };

    @Get('/:id')
    getStudent(@Param('id', ParseIntPipe)  id:number){
        return this.studentService.getStudent(id);
    };

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createStudent(@Body() student:any){
        return this.studentService.createStudent(student);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editStudent(@Param('id', ParseIntPipe) id:number, @Body() student:any){
        return this.studentService.editStudent(id, student);
    };

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteStudent(@Param('id', ParseIntPipe) id:number){
        return this.studentService.deleteStudent(id);
    };

}
