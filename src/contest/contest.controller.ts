import { Controller ,Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe,} from '@nestjs/common';
import { ContestService } from './contest.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('contest')
export class ContestController {
    constructor(private readonly contesService:ContestService){

    }
    @UseGuards(AuthGuard('jwt'))
    @Get('')
    getContests(){
        return this.contesService.getContests();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getContest(@Param('id', ParseIntPipe) id:number){
        return this.contesService.getContest(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createContest(@Body() contest:any){
        return this.contesService.createContest(contest);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editContest(@Param('id', ParseIntPipe) id:number, @Body() contest:any){
        return this.contesService.editContest(id, contest);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteContest(@Param('id', ParseIntPipe) id:number){
        return this.contesService.deleteContest(id);
    }


}
