import { Controller, Get, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from 'src/dto/categories/createCategoryDto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente.' })
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Post('post')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async postCategories(@Body() category: CreateCategoryDto) {
    if(await this.categoriesService.thisCategoryExist(category.name)) throw new InternalServerErrorException('Esta categoria ya existe')
    return await this.categoriesService.createCategory(category)
  }

  @Post('seeder')
  @ApiOperation({ summary: 'Precargar categorías' })
  @ApiResponse({ status: 201, description: 'Categorías precargadas exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async seederCategories() {
    if((await this.categoriesService.getCategories()).length) throw new InternalServerErrorException('Solo usar cuando las categorias esten vacias'); 

    await this.categoriesService.preloadCategories();

    return '¡Precarga realizada con exito!';
  }
}