import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inscription')
export class InscriptionController {
    constructor(private readonly inscriptionService: InscriptionService ){}

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    getInscriptions(){
        return this.inscriptionService.getInscriptions();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    getInscription(@Param('id',ParseIntPipe) id:number){
        return this.inscriptionService.getInscription(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    createInscription(@Body() inscription:any){
        return this.inscriptionService.createInscription(inscription);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    editInscription(@Param('id', ParseIntPipe) id:number, @Body() inscription:any){
        return this.inscriptionService.editInscription(id,inscription);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteInscription(@Param('id', ParseIntPipe) id:number){
        return this.inscriptionService.deleteInscription(id);
    }
}

