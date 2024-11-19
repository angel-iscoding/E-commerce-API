import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { UsersRepository } from '../../user-management/users/user.repository';
import { ProductsRepository } from '../products/product.repository';
import { OrderDetailRepository } from '../ordersDetails/orderDetail.repository';
import { OrderDto } from 'src/database/orders/order.dto';
import { CartService } from '../cart/cart.service';
import { OrderDetail } from '../ordersDetails/orderDetail.entity';

@Injectable()
export class OrderService {
    constructor (
        private readonly ordersRepository: OrderRepository,
        private readonly ordersDetailRepository: OrderDetailRepository, 
        private readonly usersRepository: UsersRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly cartService: CartService,
    ) {}

    async createOrder(order: OrderDto): Promise<Order> {

        const user = await this.usersRepository.getUserById(order.user);
        const timestamp = new Date();

        if (!user) throw new NotFoundException('No existe el usuario');

        // Crear la orden sin detalles iniciales
        const newOrder = new Order();
        newOrder.date = timestamp;

        // Obtener productos existentes l
        const products = await this.cartService.getAllProductsOfUserCart(user.id)

        const existingProducts = await Promise.all (
            products.map(async (productId) => {
                const product = await this.productsRepository.getProductById(productId);
                return product || null;
            })
        )

        // Guardar la nueva orden en la base de datos
        const createdOrder = await this.ordersRepository.save(newOrder);

        const totalPrice = existingProducts.reduce((sum, product) => sum + product.price, 0); 

        // Crear el detalle de la orden
        const orderDetail = new OrderDetail();

        // Guardar el detalle de la orden
        const newOrderDetail = await this.ordersDetailRepository.save(orderDetail);

        // Asignar el detalle de la orden a la orden creada y guardar los cambios
        createdOrder.orderDetail = newOrderDetail;

        // Guardar la orden con su detalle

        return await this.ordersRepository.save(createdOrder);
    }


    async getAllOrders(): Promise<Order[]> {
        return await this.ordersRepository.getAllOrders();
    }

    async getById(id: string): Promise<Order | null> {
        return await this.ordersRepository.getById(id);
    }
}