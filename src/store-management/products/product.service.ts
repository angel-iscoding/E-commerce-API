import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./product.repository";
import { Product } from "./product.entity";
import { ProductDto } from "src/database/products/product.dto";

@Injectable()
export class ProductsService {
    constructor (
      private readonly productsRepository: ProductsRepository,
    ) {}

    async getAllProducts (): Promise<Product[]> {
      return await this.productsRepository.getAllProducts();
    }

    async createProduct (product: ProductDto): Promise<Product> {
      return await this.productsRepository.createProduct(product);
    }

    async updateProduct (id: string, updateProduct: ProductDto): Promise<Product | undefined> { 
      return await this.productsRepository.updateProduct(id, updateProduct);
    }

    async deleteProduct(id: string): Promise<void> {
      return await this.productsRepository.deleteProduct(id);
    }

    async thisProductExist(name: string): Promise<boolean> {
      if(await this.productsRepository.findByName(name)) return Promise.resolve(true);
      return Promise.resolve(false)
    }

    async updateProductImage(id: string, imageUrl: string): Promise<Product> {
      const product = await this.productsRepository.getProductById(id);
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      product.imgUrl = imageUrl;
      return this.productsRepository.updateProduct(id, product);
    }

    async preloadProducts(): Promise<void> {
      const preloadProducts: ProductDto[] = [
            {
              "name": "Iphone 15",
              "description": "The best smartphone in the world",
              "price": 199.99,
              "stock": 12,
              "imgUrl": "None",
  
            },
            {
              "name": "Samsung Galaxy S23",
              "description": "The best smartphone in the world",
              "price": 150.0,
              "stock": 12,
              "imgUrl": "None",
  
            },
            {
              "name": "Motorola Edge 40",
              "description": "The best smartphone in the world",
              "price": 179.89,
              "stock": 12,
              "imgUrl": "None",
  
            },
            {
              "name": "Samsung Odyssey G9",
              "description": "The best monitor in the world",
              "price": 299.99,
              "stock": 12,
              "imgUrl": "None",
          },
            {
              "name": "LG UltraGear",
              "description": "The best monitor in the world",
              "price": 199.99,
              "stock": 12,
              "imgUrl": "None",
          },
            {
              "name": "Acer Predator",
              "description": "The best monitor in the world",
              "price": 150.0,
              "stock": 12,
              "imgUrl": "None",
          },
            {
              "name": "Razer BlackWidow V3",
              "description": "The best keyboard in the world",
              "price": 99.99,
              "stock": 12,
              "imgUrl": "None",
             },
            {
              "name": "Corsair K70",
              "description": "The best keyboard in the world",
              "price": 79.99,
              "stock": 12,
              "imgUrl": "None",
             },
            {
              "name": "Logitech G Pro",
              "description": "The best keyboard in the world",
              "price": 59.99,
              "stock": 12,
              "imgUrl": "None",
             },
            {
              "name": "Razer Viper",
              "description": "The best mouse in the world",
              "price": 49.99,
              "stock": 12,
              "imgUrl": "None",        },
            {
              "name": "Logitech G502 Pro",
              "description": "The best mouse in the world",
              "price": 39.99,
              "stock": 12,
              "imgUrl": "None",        },
            {
              "name": "SteelSeries Rival 3",
              "description": "The best mouse in the world",
              "price": 29.99,
              "stock": 12,
              "imgUrl": "None",        }
      ]

      const validProducts = preloadProducts.filter(product => product !== null);
  
      for (const product of validProducts) {
          await this.productsRepository.createProduct(product);
      }
    }
}