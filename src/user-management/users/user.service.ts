import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "./user.repository";
import { UserDto } from "src/database/users/user.dto";
import * as bcrypt from 'bcryptjs';
import { User } from "./user.entity";
import { CartRepository } from "src/store-management/cart/cart.repository";
import { Cart } from "src/store-management/cart/cart.entity";

@Injectable()
export class UsersService {
    constructor (
        private readonly usersRepository: UsersRepository,
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

    async getUserById(id: string): Promise<Omit<User, "password" | null>> {
        return await this.usersRepository.getUserById(id);
    }

    async findByEmail(email: string): Promise<Omit<User, "password" | null>> {
        return await this.usersRepository.findOneByEmail(email);
    }

    async comparePassword(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOneByEmail(email);

        if (!user) throw new NotFoundException('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

        return user;
    }
    

    async createUser(userDto: UserDto): Promise<User> {
        const user: User = await this.usersRepository.create(userDto);

        const cart: Cart = await this.cartRepository.create(user);

        return user;
    }

    async updateUser(id: string, updatedUser: UserDto):Promise<User> {
        return await this.usersRepository.updateUser(id, updatedUser);
    }

    async deleteUser(id: string): Promise<void> {
        await await this.usersRepository.deleteUser(id);
    }
}