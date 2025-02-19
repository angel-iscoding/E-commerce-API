import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Cart } from "src/store-management/cart/cart.entity";
import { Product } from "../products/product.entity";
import { User } from "src/user-management/users/user.entity";

@Injectable()
export class CartRepository {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>
    ) {}

    async getAllCart(): Promise<Cart[]> {
        return await this.cartRepository.find({
            relations: ['products', 'user']
        }); 
    }

    async getCartById(id: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { id },
            relations: ['products', 'user']
        });

        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }

        return cart;
    }

    async getCartByUserId(userId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['products', 'user']
        });

        if (!cart) {
            throw new NotFoundException(`Cart for user ${userId} not found`);
        }

        return cart;
    }

    async save(cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }

    async create(user: User): Promise<Cart> {
        const cart = await this.cartRepository.create({ user });
        return await this.cartRepository.save(cart) 
    }

    async removeProductFromCart(userId: string, productId: string): Promise<void> {
        const cart = await this.getCartByUserId(userId);
        
        cart.products = cart.products.filter(product => product.id !== productId);
        
        // Recalcular el precio total
        cart.price = cart.products.reduce((total, product) => total + product.price, 0);
        
        await this.save(cart);
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCartByUserId(userId);
        
        cart.products = [];
        cart.price = 0;
        
        await this.save(cart);
    }

    async addProducts(cart: Cart, products: Product[]): Promise<Cart> {
        cart.products = [...cart.products, ...products];
        
        // Recalcular el precio total
        cart.price = cart.products.reduce((total, product) => total + product.price, 0);
        
        return await this.save(cart);
    }

    async updateCartPrice(cartId: string): Promise<void> {
        const cart = await this.getCartById(cartId);
        
        cart.price = cart.products.reduce((total, product) => total + product.price, 0);
        
        await this.save(cart);
    }
}