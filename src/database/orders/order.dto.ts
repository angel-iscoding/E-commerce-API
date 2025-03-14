import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Product } from "src/store-management/products/product.entity";

export class OrderDto {
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsUUID()
    @IsNotEmpty()
    user: string;

    @IsArray()
    @IsNotEmpty()
    product: Product[];
}