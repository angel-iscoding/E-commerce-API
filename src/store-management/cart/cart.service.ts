import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartRepository } from './cart.repository';
import { UsersRepository } from 'src/user-management/users/user.repository';
import { ProductsRepository } from '../products/product.repository';
import { Product } from '../products/product.entity';
import { CartRedisService } from './cart-redis.service';
import { User } from 'src/user-management/users/user.entity';

@Injectable()
export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private userRepository: UsersRepository,
        private productRepostory: ProductsRepository,
        private cartRedisService: CartRedisService,
    ) {}

    async getAllCart(): Promise<Cart[]> {
        return await this.cartRepository.getAllCart();
    }

    async thisUserExist (userId: string): Promise<boolean> {
        const user: User | undefined = await this.userRepository.getUserById(userId);
        return user ? true : false  
    }

    async getCart(cartId: string, isAuthenticated: boolean): Promise<Cart> {
        if (isAuthenticated) return await this.cartRepository.getCartById(cartId); 
        const cartTemporaly = await this.cartRedisService.getTemporaryCart(cartId);

        if (!cartTemporaly) throw new NotFoundException('Carrito no encontrado');

        return cartTemporaly
    }

    async getCartByUser(id: string): Promise<Cart | undefined> {
        const user = await this.userRepository.getUserById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado')
        
        return user.cart
    }

    async addProductToCart(userId: string, productId: string[], isAuthenticated: boolean): Promise<void> {
        const products = await Promise.all(
            productId.map(async (id) => {
                const product = await this.productRepostory.getProductById(id);
                if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
                return product;
            })
        );   

        if (isAuthenticated) {
            // Usuario autenticado: solo guardar en DB
            await this.addProductToUserCart(userId, productId);
        } else {
            // Usuario no autenticado: solo guardar en Redis
            const temporaryCart = await this.cartRedisService.getTemporaryCart(userId);
            const updatedProducts = [...temporaryCart.products, ...products];
            await this.cartRedisService.updateTemporaryCart(userId, updatedProducts);
        }
    }

    async addProductToUserCart(id: string, productId: string[]): Promise<Cart> {
        const cart = await this.cartRepository.getCartById(id);

        if (!cart) throw new NotFoundException('Error al encontrar el usuario');

        // Verificar si el carrito existe
        
        const validProducts = await Promise.all(productId.map(async (currentProduct) => {    
            const product = await this.productRepostory.getProductById(currentProduct);
            if (!product) return;
            return product;
        }));

        for (const currentProduct of validProducts) {
            if (currentProduct) {
                cart.products.push(currentProduct);
            }
        }

        // Recalcular el precio total del carrito
        cart.price = Number(cart.products.reduce((total, currentProduct) => {
            return total + Number(currentProduct.price);
        }, 0).toFixed(2));

        return await this.cartRepository.save(cart);
    }

    async buyCart(userId: string): Promise<boolean> {
        const user: User = await this.userRepository.getUserById(userId);
        
        if (!user) throw new NotFoundException('Usuario no encontrado');

        const cart: Cart = await this.cartRepository.getCartById(user.id);

        if (!cart) throw new NotFoundException('Carrito no encontrado');

        // Lógica para realizar la compra
        // ...

        // Limpiar carrito

        cart.products.forEach(async (product) => {
            await this.productRepostory.downStock(product);
        });

        await this.cartRepository.clearCart(cart);

        return true;
    }


    async deleteProduct(id: string, productId: string[]): Promise<Cart> {
        const user = await this.userRepository.getUserById(id)

        if (!user) throw new NotFoundException ('Error al encontrar el usuario');

        const productsToDelete: Product[] = await Promise.all(productId.map(async (product) => {
            const currentProduct: Product = await this.productRepostory.getProductById(product)
            
            if (!currentProduct) return

            return currentProduct
        }))

        user.cart.products.filter(clientProduct => 
            !productsToDelete.some(productToDelete => productToDelete.id === clientProduct.id)
        )

        return await this.cartRepository.save(user.cart)
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

    async migrateCartToUser(temporaryUserId: string, authenticatedUserId: string): Promise<void> {
        // Cuando un usuario inicia sesión, migrar su carrito temporal a la DB
        const temporaryCart = await this.cartRedisService.getTemporaryCart(temporaryUserId);

        if (temporaryCart.products.length > 0) {
            const productIds = temporaryCart.products.map(product => product.id);
            await this.addProductToUserCart(authenticatedUserId, productIds);
            // Limpiar el carrito temporal
            await this.cartRedisService.removeTemporaryCart(temporaryUserId);
        }
    }

    async removeFromCart(userId: string, productId: string, isAuthenticated: boolean): Promise<void> {
        if (isAuthenticated) {
            // Remover de la base de datos
            await this.cartRepository.removeProductFromCart(userId, productId);
        } else {
            // Remover de Redis
            const temporaryCart = await this.cartRedisService.getTemporaryCart(userId);
            const updatedProducts = temporaryCart.products.filter(product => product.id !== productId);
            await this.cartRedisService.updateTemporaryCart(userId, updatedProducts);
        }
    }

    async clearCart(userId: string, isAuthenticated: boolean): Promise<void> {
        if (isAuthenticated) {
            // Limpiar carrito en la base de datos
            await this.cartRepository.clearCart(await this.cartRepository.getCartByUserId(userId));
        } else {
            // Limpiar carrito en Redis
            await this.cartRedisService.removeTemporaryCart(userId);
        }
    }
}