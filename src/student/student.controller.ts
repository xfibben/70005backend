import { Controller, Put,Param, Body, Get , Post, Delete} from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {

    constructor(private readonly studentService:StudentService) {}

    @Get('/')
    getStudents(){
        return this.studentService.getStudents();
    };

    @Get('/:id')
    getStudent(@Param('id') id:number){
        return this.studentService.getStudent(id);
    };

    @Post('/')
    createStudent(@Body() student:any){
        return this.studentService.createStudent(student);
    }

    @Put('/:id')
    editStudent(@Param('id') id:number, @Body() student:any){
        return this.studentService.editStudent(id, student);
    };

}
