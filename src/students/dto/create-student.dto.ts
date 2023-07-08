import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ type: String })
  dni: string;
  @ApiProperty({ type: String })
  nombres: string;
  @ApiProperty({ type: String })
  apellidos: string;
  @ApiProperty({ type: Number })
  colegioId: number;

  @ApiProperty({ type: String })
  grado: string;

  @ApiProperty({ type: Number })
  precio: number;
  @ApiProperty({ type: Boolean })
  pagado: boolean;
}
