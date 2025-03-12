import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsUUID, isUUID } from "class-validator";
import { Role } from "src/config/role.enum";

export class PayloadDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    roles: Role[];

    @IsNumber()
    @IsOptional()
    iat?: number;

    @IsNumber()
    @IsOptional()
    exp?: number;
}