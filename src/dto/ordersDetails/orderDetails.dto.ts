import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Order } from "src/modules/orders/order.entity";
import { Product } from "src/modules/products/product.entity";
import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto {
    @ApiProperty({
        example: 100.50,
        description: 'Precio total de la orden',
    })
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({
        description: 'Orden asociada al detalle',
        type: () => Order
    })
    @IsNotEmpty()
    order: Order;

    @ApiProperty({
        description: 'Productos incluidos en la orden',
        type: () => [Product],
        isArray: true
    })
    @IsOptional()
    products?: Product[];
}