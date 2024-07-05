import { Controller, Get,Post, Put, Delete,Param, UseGuards , Body, ParseIntPipe} from '@nestjs/common';
import { GradeService } from './grade.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('grade')
export class GradeController {
    constructor(private readonly gradeService:GradeService){};

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getGrades(){
        return this.gradeService.getGrades();
    };

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getGrade(@Param('id', ParseIntPipe) id:number){
        return this.gradeService.getGrade(id);
    };

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createGrade(@Body() grade:any){
        return this.gradeService.createGrade(grade);
    };

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editGrade(@Param('id', ParseIntPipe) id:number, @Body() grade:any){
        return this.gradeService.editGrade(id, grade);
    };

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteGrade(@Param('id', ParseIntPipe) id:number){
        return this.gradeService.deleteGrade(id);
    };

}
