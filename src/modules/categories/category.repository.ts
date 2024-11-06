import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/modules/categories/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'src/dto/categories/createCategoryDto';

@Injectable()
export class CategoriesRepository{
  constructor (
    @InjectRepository(Category)
    private categorriesRepository: Repository<Category>
  ) {}
  
  async getCategories(): Promise<Category[]> {
    return await this.categorriesRepository.find();
  }

  async createCategory(category: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categorriesRepository.create(category)
    return await this.categorriesRepository.save(newCategory);
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.categorriesRepository.findOne({ where: { name: name}}) 
  }
}