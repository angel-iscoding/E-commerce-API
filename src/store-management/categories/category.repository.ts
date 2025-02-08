import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/store-management/categories/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'src/database/categories/createCategoryDto';

@Injectable()
export class CategoriesRepository{
  constructor (
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}
  
  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async createCategory(category: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category)
    return await this.categoriesRepository.save(newCategory);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return await this.categoriesRepository.findOne({ where: { name: name}}) 
  }

  async findById(id: string): Promise<Category | undefined> {
    return await this.categoriesRepository.findOne({where: {id: id}})
  }

  async deleteCategory (id: string): Promise<void> {
    const categoryToDelete = await this.findById(id);
    if (!categoryToDelete) return;

    await this.categoriesRepository.delete(categoryToDelete);
  }
}