import { IsNotEmpty, IsNumber, IsOptional, IsArray } from "class-validator";
import { Order } from "src/store-management/orders/order.entity";
import { Product } from "src/store-management/products/product.entity";
import { ApiProperty } from '@nestjs/swagger';

export class NewOrderDetailDto {
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
    @IsArray()
    products?: Product[];
}