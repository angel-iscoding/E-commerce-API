import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'john.doe@example.com', description: 'Correo electrónico del usuario', required: false })
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'John Doe', description: 'Nombre del usuario', required: false })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsOptional()
    name?: string

    @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario', required: false })
    @IsNotEmpty()
    @MinLength(8)
    @IsOptional()
    @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'La contraseña debe contener al menos una mayúscula y un número',
    })
    password?: string;

    @ApiProperty({ example: '123 Main St', description: 'Dirección del usuario', required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 1234567890, description: 'Número de teléfono del usuario', required: false })
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    phone?: number

    @ApiProperty({ example: 'USA', description: 'País del usuario', required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'New York', description: 'Ciudad del usuario', required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    city?: string;
}