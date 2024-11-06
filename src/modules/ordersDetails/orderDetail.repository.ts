import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";;
import { OrderDetail } from "./orderDetail.entity";
import { NewOrderDetailDto } from "src/dto/ordersDetails/newOrderDetails.dto";

@Injectable()
export class OrderDetailRepository {
    constructor(
        @InjectRepository(OrderDetail)
        private ordersRepository: Repository<OrderDetail>
    ) {}

    async getAllOrdersDetail() {
      return await this.ordersRepository.find()
    }

    async create(newOrderDetail: NewOrderDetailDto): Promise<OrderDetail> {
      return await this.ordersRepository.create(newOrderDetail);;
    }

    async save(newOrderDetail: NewOrderDetailDto): Promise<OrderDetail> {
      return await this.ordersRepository.save(newOrderDetail);;
    }

    async getOrderDetailById(id: string): Promise<OrderDetail | null> {
      return await this.ordersRepository.findOne({where: {id: id}});
    }
}