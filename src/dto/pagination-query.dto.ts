import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
    @ApiProperty({ example: 1, description: 'Número de página', required: false })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiProperty({ example: 10, description: 'Límite de elementos por página', required: false })
    @IsOptional()
    @IsNumber()
    limit?: number;
}