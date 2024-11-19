import { IsString, IsNumber, IsOptional, IsDecimal, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'Smartphone XYZ', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Un smartphone de última generación', description: 'Descripción del producto' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 599.99, description: 'Precio del producto' })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 100, description: 'Cantidad en stock del producto' })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL de la imagen del producto', required: false })
  @IsString()
  @IsOptional()
  imgUrl?: string;
}