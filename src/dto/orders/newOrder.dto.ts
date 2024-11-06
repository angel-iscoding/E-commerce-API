import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { OrderDetail } from "src/modules/ordersDetails/orderDetail.entity";
import { User } from "src/modules/users/user.entity";
import { ApiProperty } from '@nestjs/swagger';

export class NewOrderDto {
    @ApiProperty({
        example: '2023-05-20T10:30:00Z',
        description: 'Fecha y hora de la orden',
    })
    @IsDate()
    @IsNotEmpty()
    date: Date

    @ApiProperty({
        description: 'Usuario que realiza la orden',
        type: () => User
    })
    @IsNotEmpty()
    user: User

    @ApiProperty({
        description: 'Detalles de la orden (opcional)',
        type: () => OrderDetail,
        required: false
    })
    @IsOptional()
    orderDetail?: OrderDetail;
}