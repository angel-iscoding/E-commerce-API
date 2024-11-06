import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message: 'La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({ example: 1234567890 })
  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  country: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  city: string;

  @ApiProperty({ example: false, description: 'Indica si el usuario es administrador' })
  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}
