import { ApiProperty } from "@nestjs/swagger";

export class RemoveFromCartDto {
    @ApiProperty({ description: 'ID del usuario o ID temporal', example: 'user123' })
    userId: string;

    @ApiProperty({ description: 'ID del producto a remover', example: 'product123' })
    productId: string;
}