import { IsArray, IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsUUID()
    @IsNotEmpty()
    user: string;

    @IsUUID()
    @IsNotEmpty()
    orderDetail: string;
}