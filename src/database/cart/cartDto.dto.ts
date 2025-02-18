import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class cartDto {
    @ApiProperty({ description: 'ID del usuario o ID temporal', example: 'user123' })
    @IsOptional()
    @IsString()
    userId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ 
        description: 'Array de IDs de productos', 
        example: ['product1', 'product2'],
        type: [String]
    })
    products: string[];
}
