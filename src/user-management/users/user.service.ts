import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./user.repository";
import { UserDto } from "src/database/users/user.dto";
import * as bcrypt from 'bcryptjs';
import { User } from "./user.entity";
import { OrderRepository } from "src/store-management/orders/order.repository";
import { CartRepository } from "src/store-management/cart/cart.repository";
import { Cart } from "src/store-management/cart/cart.entity";
import { Order } from "src/store-management/orders/order.entity";

@Injectable()
export class UsersService {
    constructor (
        private readonly usersRepository: UsersRepository,
        private readonly orderRepository: OrderRepository,
        private readonly cartRepository: CartRepository,
    ) {}

    async getAllUsers(page: number = 1, limit: number = 5): Promise<Omit<User[], 'password'>[]>  {
        const users = await this.usersRepository.getAllUsers();

        const pages = []

        for (let i = page; i < page+1; i++) {
            const skip = (i - 1) * limit;
            const section = users.slice(skip, skip + limit);

            pages.push({page: i, content: section})
        }

        return pages; 
    }

    async getUserById(id: string): Promise<User | null> {
        return this.usersRepository.getUserById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneByEmail(email);
    }

    async createUser(createUserDto: UserDto & { admin?: boolean }): Promise<User> {
        const user: UserDto = {
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        };

        const savedUser = await this.usersRepository.createUser(user);

        const newCart = new Cart();
        newCart.user = savedUser;
        await this.cartRepository.save(newCart);

        const newOrder = new Order();
        newOrder.user = savedUser;
        await this.orderRepository.save(newOrder);

        return savedUser
    }

    async updateUser(id: string, updatedUser: UserDto):Promise<User> {
        return this.usersRepository.updateUser(id, updatedUser);
    }

    async deleteUser(id: string): Promise<void> {
        await this.usersRepository.deleteUser(id);
    }
}