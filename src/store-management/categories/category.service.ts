import { Injectable } from '@nestjs/common';
import { Category } from 'src/store-management/categories/category.entity';
import { CategoriesRepository } from './category.repository';
import { CreateCategoryDto } from 'src/database/categories/createCategoryDto';

@Injectable()
export class CategoriesService {
  constructor(
    private categoriesRepository: CategoriesRepository,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.getCategories();
  }

  async createCategory(category: CreateCategoryDto) : Promise<Category> {
    return await this.categoriesRepository.createCategory(category);
  }

  async findByName (name: string): Promise<Category | undefined> {
    return await this.categoriesRepository.findByName(name);
  }

  async thisCategoryExist(name: string): Promise<boolean> {
    if (await this.categoriesRepository.findByName(name)) return Promise.resolve(true); 
    return Promise.resolve(false);
  }

  async preloadCategories (): Promise<void> {
    const preloadCategories: CreateCategoryDto[] = [
      { name: 'Electronics' },
      { name: 'Clothing' },
      { name: 'Books' },
      { name: 'Furniture' },
      { name: 'Toys' },
      { name: 'Groceries' },
      { name: 'Beauty' },
      { name: 'Sports' },
      { name: 'Home Decor' },
      { name: 'Jewelry' }, 
      { name: "smartphone" },
      { name: "monitor" },
      { name: "keyboard" },
      { name: "mouse"}
    ];

    await Promise.all(
      preloadCategories.map(category => 
          this.categoriesRepository.createCategory(category)
      )
    );
  }
}