import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";;
import { OrderDetail } from "./orderDetail.entity";
import { OrderDetailDto } from "src/database/ordersDetails/orderDetail.dto";

@Injectable()
export class OrderDetailRepository {
    constructor(
        @InjectRepository(OrderDetail)
        private ordersRepository: Repository<OrderDetail>
    ) {}

    async getAllOrdersDetail() {
      return await this.ordersRepository.find()
    }

    async create(newOrderDetail: OrderDetail): Promise<OrderDetail> {
      return await this.ordersRepository.create(newOrderDetail);
    }

    async save(newOrderDetail: OrderDetail): Promise<OrderDetail> {
      return await this.ordersRepository.save(newOrderDetail);;
    }

    async getOrderDetailById(id: string): Promise<OrderDetail | null> {
      return await this.ordersRepository.findOne({where: {id: id}});
    }
}