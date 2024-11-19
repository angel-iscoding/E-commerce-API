import { Controller, Get, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from 'src/database/categories/createCategoryDto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Post('post')
  async postCategories(@Body() category: CreateCategoryDto) {
    if(await this.categoriesService.thisCategoryExist(category.name)) throw new InternalServerErrorException('Esta categoria ya existe')
    return await this.categoriesService.createCategory(category)
  }

  @Post('seeder')
  async seederCategories() {
    if((await this.categoriesService.getCategories()).length) throw new InternalServerErrorException('Solo usar cuando las categorias esten vacias'); 

    await this.categoriesService.preloadCategories();

    return '¡Precarga realizada con exito!';
  }
}