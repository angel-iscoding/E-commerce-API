import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ 
        example: 'john.doe@example.com',
        description: 'Email del usuario'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ 
        example: 'Password123!',
        description: 'Contraseña del usuario'
    })
    @IsNotEmpty()
    password: string;
}