import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { UsersRepository } from '../../user-management/users/user.repository';
import { ProductsRepository } from '../products/product.repository';
import { OrderDto } from 'src/database/orders/order.dto';
import { CartService } from '../cart/cart.service';
import { User } from 'src/user-management/users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrderService {
    constructor (
        private readonly ordersRepository: OrderRepository,
        private readonly usersRepository: UsersRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly cartService: CartService,
    ) {}

    async createOrder(order: OrderDto): Promise<Order> {

        const user = await this.usersRepository.getUserById(order.user);
        const timestamp: Date = new Date();

        if (!user) throw new NotFoundException('No existe el usuario');

        // Crear la orden sin detalles iniciales
        const newOrder: Order = await this.ordersRepository.create(user);
        newOrder.date = timestamp;

        // Obtener productos existentes l
        const products = await this.cartService.getAllProductsOfUserCart(user.id)

        newOrder.product = await Promise.all (
            products.map(async (productId) => {
                const product = await this.productsRepository.getProductById(productId);
                return product || null;
            })
        )

        newOrder.price = newOrder.product.reduce((sum, product) => sum + product.price, 0); 

        return await this.ordersRepository.save(newOrder);
    }


    async getAllOrders(): Promise<Order[]> {
        return await this.ordersRepository.getAllOrders();
    }

    async getById(id: string): Promise<Order | null> {
        return await this.ordersRepository.getById(id);
    }

    async getOrdersOfUser(id: string): Promise<Order[]> {
        const user: User = await this.usersRepository.getUserById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado');

        return user.orders;
    }
}