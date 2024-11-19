import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';
import { UsersRepository } from 'src/user-management/users/user.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private userRepository: UsersRepository,
    ) {}

    async getAllCart(): Promise<Cart[]> {
        return await this.cartRepository.getAllCart();
    }

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