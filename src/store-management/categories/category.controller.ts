import { Controller, Get, Post, Body, InternalServerErrorException, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { Category } from './category.entity';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from 'src/database/categories/createCategoryDto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/config/role.enum';
import { Roles } from 'src/config/role.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    if(await this.categoriesService.thisCategoryExist(createCategoryDto.name)) throw new InternalServerErrorException('Esta categoria ya existe')
    return await this.categoriesService.createCategory(createCategoryDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }

  @Post('seeder')
  async seederCategories() {
    if((await this.categoriesService.getCategories()).length) throw new InternalServerErrorException('Solo usar cuando las categorias esten vacias'); 

    await this.categoriesService.preloadCategories();

    return '¡Precarga realizada con exito!';
  }
}