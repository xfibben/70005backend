import { Controller , Get, Post, Put, Delete, UseGuards, Param, Body,Res, ParseIntPipe } from '@nestjs/common';
import { TestService } from './test.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTestDto, EditTestDto } from './dto/test.dto';
import { Response } from 'express';


@Controller('test')
export class TestController {
    constructor(private readonly testService:TestService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getTests(){
        return this.testService.getTests();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getTest(@Param('id', ParseIntPipe) id:number){
        return this.testService.getTest(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createTest(@Body() test:CreateTestDto){
        return this.testService.createTest(test);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editTest(@Param('id', ParseIntPipe) id:number, @Body() test:EditTestDto){
        return this.testService.editTest(id, test);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteTest(@Param('id', ParseIntPipe) id:number){
        return this.testService.deleteTest(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/excel/:id')
    exportRanking(@Param('id', ParseIntPipe) id:number,@Res() res: Response){
        return this.testService.exportRankingbyTest(id,res);
    }

}
