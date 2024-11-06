import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./product.repository";
import { UpdateProductDto } from "src/database/products/updateProduct.dto";
import { CategoriesRepository } from "../categories/category.repository";
import { ProductDto } from "src/database/products/product.dto";
import { NewProductDto } from "src/database/products/newProduct.dto";
import { Product } from "./product.entity";

@Injectable()
export class ProductsService {
    constructor (
      private readonly productsRepository: ProductsRepository,
      private readonly categoriesRepository: CategoriesRepository,
    ) {}

    async getAllProducts () {
      return await this.productsRepository.getAllProducts();
    }

    async createProduct (product: NewProductDto) {
      return await this.productsRepository.createProduct(product);
    }

    async updateProduct (id: string, updateProduct: UpdateProductDto) {
      return await this.productsRepository.updateProduct(id, updateProduct);
    }

    async deleteProduct(id: string) {
      return await this.productsRepository.deleteProduct(id);
    }

    async thisProductExist(name: string): Promise<boolean> {
      if(await this.productsRepository.findByName(name)) return Promise.resolve(true);
      return Promise.resolve(false)
    }

    async preloadProducts(): Promise<void> {
        const preloadProducts: ProductDto[] = [
            {
              "name": "Iphone 15",
              "description": "The best smartphone in the world",
              "price": 199.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "smartphone"
            },
            {
              "name": "Samsung Galaxy S23",
              "description": "The best smartphone in the world",
              "price": 150.0,
              "stock": 12,
              "imgUrl": "None",
              "category": "smartphone"
            },
            {
              "name": "Motorola Edge 40",
              "description": "The best smartphone in the world",
              "price": 179.89,
              "stock": 12,
              "imgUrl": "None",
              "category": "smartphone"
            },
            {
              "name": "Samsung Odyssey G9",
              "description": "The best monitor in the world",
              "price": 299.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "monitor"
            },
            {
              "name": "LG UltraGear",
              "description": "The best monitor in the world",
              "price": 199.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "monitor"
            },
            {
              "name": "Acer Predator",
              "description": "The best monitor in the world",
              "price": 150.0,
              "stock": 12,
              "imgUrl": "None",
              "category": "monitor"
            },
            {
              "name": "Razer BlackWidow V3",
              "description": "The best keyboard in the world",
              "price": 99.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "keyboard"
            },
            {
              "name": "Corsair K70",
              "description": "The best keyboard in the world",
              "price": 79.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "keyboard"
            },
            {
              "name": "Logitech G Pro",
              "description": "The best keyboard in the world",
              "price": 59.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "keyboard"
            },
            {
              "name": "Razer Viper",
              "description": "The best mouse in the world",
              "price": 49.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "mouse"
            },
            {
              "name": "Logitech G502 Pro",
              "description": "The best mouse in the world",
              "price": 39.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "mouse"
            },
            {
              "name": "SteelSeries Rival 3",
              "description": "The best mouse in the world",
              "price": 29.99,
              "stock": 12,
              "imgUrl": "None",
              "category": "mouse"
            }
        ]

        const productsWithCategory: NewProductDto[] = await Promise.all(
          preloadProducts.map(async (product) => {
              const category = await this.categoriesRepository.findByName(product.category);
  
              if (!category) {
                  console.error(`Category ${product.category} not found`);
                  return null; 
              }
              return {
                  ...product,
                  category 
              };
          })
      );
  
      const validProducts = productsWithCategory.filter(product => product !== null);
  
      for (const product of validProducts) {
          await this.productsRepository.createProduct(product);
      }
    }

    async updateProductImage(id: string, imageUrl: string): Promise<Product> {
      const product = await this.productsRepository.getProductById(id);
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      product.imgUrl = imageUrl;
      return this.productsRepository.updateProduct(id, product);
    }
}