import { IsEmail, IsNotEmpty, IsNumberString, IsString, Matches, MinLength, IsArray, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string

    @ApiProperty({ example: 'Password123!' })
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'La contraseña debe contener al menos una mayúscula y un número',
    })
    password: string;

    @ApiProperty({ example: '123 Main St' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 1234567890 })
    @IsNumberString()
    @IsNotEmpty()
    phone: number;

    @ApiProperty({ example: 'USA' })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    @IsNotEmpty()
    city: string;
}