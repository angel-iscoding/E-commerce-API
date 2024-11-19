import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { ProductDto } from "src/database/products/product.dto";

@Injectable()
export class ProductsRepository {
    constructor(
      @InjectRepository(Product)
      private productsRepository: Repository<Product>,
    ) {}

    private products = [
        {
          id: 1,
          name: 'Laptop',
          description: 'Powerful laptop with high-resolution display',
          price: 1200,
          stock: true,
          imgUrl: 'https://example.com/laptop.jpg',
        },
        {
          id: 2,
          name: 'Smartphone',
          description: 'Latest smartphone with dual cameras',
          price: 800,
          stock: true,
          imgUrl: 'https://example.com/smartphone.jpg',
        },
        {
          id: 3,
          name: 'Headphones',
          description: 'Wireless headphones with noise cancellation',
          price: 150,
          stock: true,
          imgUrl: 'https://example.com/headphones.jpg',
        },
        {
          id: 4,
          name: 'Tablet',
          description: 'Compact tablet for productivity and entertainment',
          price: 400,
          stock: true,
          imgUrl: 'https://example.com/tablet.jpg',
        },
        {
          id: 5,
          name: 'Camera',
          description: 'High-quality DSLR camera for photography enthusiasts',
          price: 1000,
          stock: true,
          imgUrl: 'https://example.com/camera.jpg',
        },
        {
          id: 6,
          name: 'Fitness Tracker',
          description: 'Track your steps, heart rate, and workouts',
          price: 50,
          stock: true,
          imgUrl: 'https://example.com/fitness-tracker.jpg',
        },
        {
          id: 7,
          name: 'External Hard Drive',
          description: 'Store and back up your important files',
          price: 80,
          stock: true,
          imgUrl: 'https://example.com/hard-drive.jpg',
        },
        {
          id: 8,
          name: 'Wireless Mouse',
          description: 'Ergonomic mouse for comfortable use',
          price: 30,
          stock: true,
          imgUrl: 'https://example.com/mouse.jpg',
        },
        {
          id: 9,
          name: 'Bluetooth Speaker',
          description: 'Portable speaker with great sound quality',
          price: 70,
          stock: true,
          imgUrl: 'https://example.com/speaker.jpg',
        },
        {
          id: 10,
          name: 'Gaming Console',
          description: 'Play the latest video games with friends',
          price: 300,
          stock: true,
          imgUrl: 'https://example.com/console.jpg',
        },
    ];

    async getAllProducts(): Promise<Product[]> {
      return await this.productsRepository.find(); 
    }
    
    async getProductById(id: string): Promise<Product | undefined> {
      return await this.productsRepository.findOne({where: {id: id}});
    }

    async findByName (name: string): Promise<Product | undefined> {
      return await this.productsRepository.findOne({where: {name: name}});
    }

    async createProduct(product: ProductDto): Promise<Product> {
      const newProduct = await this.productsRepository.create(product); // Probablemente haya un problema
      return await this.productsRepository.save(newProduct);
    }
    
    async updateProduct(id: string, updateProduct: ProductDto): Promise<Product | undefined> { //Probablemente haya un problema
      const productToUpdate = await this.getProductById(id);
      if (!productToUpdate) return undefined;
      
      await this.productsRepository.update(productToUpdate.id, updateProduct);

      return await this.productsRepository.findOne({where: {id: id}})
    }

    async deleteProduct(id: string): Promise<void> {
      const productToDelete = await this.getProductById(id);
      if (!productToDelete) return undefined;

      this.productsRepository.delete(productToDelete.id);
    }    
}