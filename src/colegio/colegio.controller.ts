import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Get,
  Patch,
} from '@nestjs/common';
import { ColegioService } from './colegio.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/auth.guard';
import { CreateColegioDto, UpdateColegioDto } from './dto/create-colegio.dto';
@ApiTags('colegio')
@Controller('colegio')
export class ColegioController {
  constructor(private colegioService: ColegioService) {}

  @Post()
  createColegio(@Body() colegio: CreateColegioDto) {
    return this.colegioService.createColegio(colegio);
  }

  @Get()
  getColegio() {
    return this.colegioService.getColegios();
  }

  @Get(':id')
  getColegios(@Param('id', ParseIntPipe) id: number) {
    return this.colegioService.getColegio(id);
  }

  @Patch(':id')
  updateColegio(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateColegioDto,
  ) {
    return this.colegioService.updateColegio(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteColegio(@Param('id', ParseIntPipe) id: number) {
    return this.colegioService.deleteColegio(id);
  }
}
