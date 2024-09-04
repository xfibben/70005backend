import { Controller, Put, Param, Body, Get, Post, Delete, UseGuards, ParseIntPipe, UploadedFile, UseInterceptors ,Query} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getStudents() {
        return this.studentService.getStudents();
    }

    @Get('/:id')
    getStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.getStudent(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createStudent(@Body() student: any) {
        return this.studentService.createStudent(student);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editStudent(@Param('id', ParseIntPipe) id: number, @Body() student: any) {
        return this.studentService.editStudent(id, student);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.deleteStudent(id);
    }

    // Modified route for file upload with gradeId and schoolId as query parameters
    @UseGuards(AuthGuard('jwt'))
        @Post('/upload')
        @UseInterceptors(FileInterceptor('file'))
        uploadFile(
            @UploadedFile() file: Express.Multer.File,
            @Query('gradeId', ParseIntPipe) gradeId: number, // Query parameter for gradeId
            @Query('schoolId', ParseIntPipe) schoolId: number, // Query parameter for schoolId
            @Query('testId', ParseIntPipe) testId: number // Query parameter for testId
        ) {
            return this.studentService.createStudentsFromExcel(file, gradeId, schoolId, testId);
        }
}
