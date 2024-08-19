import { Controller ,Get, Post, Put, Delete, Body, Param, UseGuards,Res, ParseIntPipe,} from '@nestjs/common';
import { ContestService } from './contest.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';


@Controller('contest')
export class ContestController {
    constructor(private readonly contestService:ContestService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    getContests(){
        return this.contestService.getContests();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getContest(@Param('id', ParseIntPipe) id:number){
        return this.contestService.getContest(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createContest(@Body() contest:any){
        return this.contestService.createContest(contest);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editContest(@Param('id', ParseIntPipe) id:number, @Body() contest:any){
        return this.contestService.editContest(id, contest);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteContest(@Param('id', ParseIntPipe) id:number){
        return this.contestService.deleteContest(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/excel/:id')
    exportRankingbyContest(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        return this.contestService.exportRankingbyContest(id, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/excel/name/:id')
    exportRankingbyContestOrderByName(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        return this.contestService.exportRankingbyContest(id, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/pdf/:id')
    exportRankingbyContestPDF(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        return this.contestService.exportRankingbyContestPDF(id, res);
    }



}
