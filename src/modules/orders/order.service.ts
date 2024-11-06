import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';
import { UsersRepository } from '../users/user.repository';
import { NewOrderDto } from 'src/dto/orders/newOrder.dto';
import { cartDto } from 'src/dto/cartDto.dto';
import { ProductsRepository } from '../products/product.repository';
import { NewOrderDetailDto } from 'src/dto/ordersDetails/newOrderDetails.dto';
import { OrderDetailRepository } from '../ordersDetails/orderDetail.repository';

@Injectable()
export class OrderService {
    constructor (
        private readonly ordersRepository: OrderRepository,
        private readonly ordersDetailRepository: OrderDetailRepository, 
        private readonly usersRepository: UsersRepository,
        private readonly productsRepository: ProductsRepository
    ) {}

    /**
     * Crea una nueva orden de compra
     * @param cart Datos del carrito de compras
     * @returns La orden creada
     */
    async createOrder(cart: cartDto): Promise<Order> {

    console.log(cart.id);

    const user = await this.usersRepository.getUserById(cart.id);
    const timestamp = new Date();

    if (!user) throw new NotFoundException('No existe el usuario');

    // Crear la orden sin detalles iniciales
    const newOrder = await this.ordersRepository.create({
        date: timestamp,
        user: user
    });

    // Guardar la nueva orden en la base de datos
    const createdOrder = await this.ordersRepository.save(newOrder);

    // Obtener productos existentes y calcular el precio total
    const existingProducts = await Promise.all(
        cart.products.map(async (productId) => {
            const product = await this.productsRepository.getProductById(productId.id);
            if (!product) throw new NotFoundException(`Producto con id ${productId.id} no encontrado`);
            return product;
        })
    );

    const totalPrice = existingProducts.reduce((sum, product) => sum + product.price, 0);

    // Crear el detalle de la orden
    const orderDetail = await this.ordersDetailRepository.create({
        price: totalPrice,
        order: createdOrder,
        products: existingProducts
    });

    // Guardar el detalle de la orden
    const newOrderDetail = await this.ordersDetailRepository.save(orderDetail);

    // Asignar el detalle de la orden a la orden creada y guardar los cambios
    createdOrder.orderDetail = newOrderDetail;

    // Guardar la orden con su detalle
    return await this.ordersRepository.save(createdOrder);
}

    /**
     * Obtiene todas las órdenes
     * @returns Lista de todas las órdenes
     */
    async getAllOrders(): Promise<Order[]> {
        return await this.ordersRepository.getAllOrders();
    }

    /**
     * Obtiene una orden por su ID
     * @param id ID de la orden
     * @returns La orden encontrada o null si no existe
     */
    async getById(id: string): Promise<Order | null> {
        return await this.ordersRepository.getById(id);
    }
}