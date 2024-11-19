import { IsArray, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class OrderDetailDto {
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsUUID()
    @IsNotEmpty()
    order: string;

    @IsUUID()
    @IsArray()
    @IsNotEmpty()
    products: string[]
}