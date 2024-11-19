import { Injectable } from '@nestjs/common';
import { OrderDetailRepository } from './orderDetail.repository';
import { OrderRepository } from '../orders/order.repository';
import { ProductsRepository } from '../products/product.repository';
import { OrderDetail } from './orderDetail.entity';

@Injectable()
export class OrderDetailService {   
  constructor (
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  getAllOrdersDetail() {
    return this.orderDetailRepository.getAllOrdersDetail();
  }

  getOrderDetailById(id: string) {
    return this.orderDetailRepository.getOrderDetailById(id);
  }

  /* async createOrderDetail(orderDetail: OrderDetailDto) {
    const order = await this.orderRepository.getById(orderDetail.order);
    const existingProducts = await Promise.all(
      orderDetail.products.map(async (id) => {
        const product = await this.productsRepository.getProductById(id);
        if (!product) return null
        return product
      })
    )

    const validProducts = existingProducts.filter(product => product !== null)

    const newOrderDetail: NewOrderDetailDto = {
      ...orderDetail,
      order,
      products: validProducts
    }

    return await this.orderDetailRepository.createOrderDetail(newOrderDetail)
  } */
}