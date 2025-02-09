import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';
import { UsersRepository } from 'src/user-management/users/user.repository';
import { ProductsRepository } from '../products/product.repository';

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private userRepository: UsersRepository,
        private productRepostory: ProductsRepository,
    ) {}

    async getAllCart(): Promise<Cart[]> {
        return await this.cartRepository.getAllCart();
    }

    async getCart(id: string): Promise<Cart> {
        return await this.cartRepository.getCartById(id);
    }

    async getCartByUser(id: string): Promise<Cart | undefined> {
        const user = await this.userRepository.getUserById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado')
        
        return user.cart
    }

    async addProductToUserCart(id: string, productId: string[]): Promise<Cart> {
        const user = await this.userRepository.getUserById(id)

        if (!user) throw new NotFoundException ('Error al encontrar el usuario');

        const validProducts = await Promise.all(productId.map(async (currentProduct) => {    
            const product = await this.productRepostory.getProductById(currentProduct);
            if (!product) return
            return product
        }));

        for (const currentProduct of validProducts) {
            if (currentProduct) {
                user.cart.products.push(currentProduct);
            }
        }

        // Recalcular el precio total del carrito
        user.cart.price = user.cart.products.reduce((total, currentProduct) => {
            return total + currentProduct.price;
        }, 0);

        return await this.cartRepository.save(user.cart);
    }

    /* async deleteProductOfCart(id: string, productId: string[]): Promise<void> {
        const user = await this.userRepository.getUserById(id)

        if (!user) throw new NotFoundException ('Error al encontrar el usuario');

        const newCart = await Promise.all(user.cart.products.map(async (currentProduct) => {

        }))
    } */

    async getAllProductsOfUserCart(userId: string): Promise<string[]> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) throw new NotFoundException('Usuario no encontrado')

        const cart = await this.cartRepository.getCartById(user.cart.id);
        
        const products = await Promise.all(
            cart.products.map(async (product) => { 
                return product.id
            })
        )

        return products;
    }
}