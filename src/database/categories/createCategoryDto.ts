import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Electrónicos',
        description: 'Nombre de la categoría',
        minLength: 3
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;
}