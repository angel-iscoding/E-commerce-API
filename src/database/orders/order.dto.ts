import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @ApiProperty({
        example: '2023-05-20T10:30:00Z',
        description: 'Fecha y hora de la orden',
    })
    @IsDate()
    @IsNotEmpty()
    date: Date

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'ID del usuario que realiza la orden',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string

    @ApiProperty({
        example: [{ id: '123e4567-e89b-12d3-a456-426614174001' }, { id: '123e4567-e89b-12d3-a456-426614174002' }],
        description: 'Array de IDs de productos en la orden',
        isArray: true
    })
    @IsNotEmpty()
    products: { id: string }[]
}