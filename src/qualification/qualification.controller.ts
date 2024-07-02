import { Controller, UseGuards, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('qualification')
export class QualificationController {
    constructor(private readonly qualificationService:QualificationService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getQualifications(){
        return this.qualificationService.getQualifications();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getQualification(@Param() id:number){
        return this.qualificationService.getQualification(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createQualification(@Param() qualification){
        return this.qualificationService.createQualification(qualification);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editQualification(@Param() id:number, @Param() qualification){
        return this.qualificationService.editQualification(id, qualification);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteQualification(@Param() id:number){
        return this.qualificationService.deleteQualification(id);
    }
}
