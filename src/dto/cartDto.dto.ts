import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { idProductDto } from "./products/idProduct.dto";
import { ApiProperty } from '@nestjs/swagger';

export class cartDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del carrito' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ 
        type: [idProductDto],
        description: 'Array de productos en el carrito',
        isArray: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => idProductDto)
    @IsNotEmpty()
    products: idProductDto[];
}
