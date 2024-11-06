import { IsString, IsNumber, IsOptional, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'Smartphone XYZ', description: 'Nombre del producto', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Un smartphone de última generación', description: 'Descripción del producto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 599.99, description: 'Precio del producto', required: false })
  @IsDecimal()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 100, description: 'Cantidad en stock del producto', required: false })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'URL de la imagen del producto', required: false })
  @IsString()
  @IsOptional()
  imgUrl?: string;
}