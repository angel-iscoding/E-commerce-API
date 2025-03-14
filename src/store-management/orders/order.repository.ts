import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { Repository } from "typeorm";
import { OrderDto } from "src/database/orders/order.dto";
import { User } from "src/user-management/users/user.entity";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>
    ) {}

    async getAllOrders(): Promise<Order[]> {
        return await this.ordersRepository.find({relations: ['user']});
    }
    async getById(id: string): Promise<Order | null> {
        return await this.ordersRepository.findOne({where: {id: id}, relations: ['user']});
    }
    async create(user: User): Promise<Order> {
        return await this.ordersRepository.create(user);
    }
    async save(order: Order): Promise<Order> {
        return await this.ordersRepository.save(order);
    }
}