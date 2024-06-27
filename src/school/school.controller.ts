import { Controller,UseGuards, Get, Post, Put, Delete, Body, Param,} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, EditSchoolDto } from './dto/school.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('school')
export class SchoolController {
    constructor(private readonly schoolService:SchoolService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getSchools(){
        return this.schoolService.getSchools();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getSchool(@Param() id:number){
        return this.schoolService.getSchool(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createSchool(@Body() school:CreateSchoolDto){
        return this.schoolService.createSchool(school);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteSchool(@Param('id')id:number){
        return this.schoolService.deleteSchool(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateSchool(@Param()id:number, @Body() school:EditSchoolDto){
        return this.schoolService.updateSchool(id, school);
    }

}
