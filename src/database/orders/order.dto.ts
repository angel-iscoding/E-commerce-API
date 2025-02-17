import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsUUID()
    @IsNotEmpty()
    user: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsUUID()
    @IsNotEmpty()
    orderDetail: string;
}