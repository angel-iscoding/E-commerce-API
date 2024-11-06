import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./user.repository";
import { UserDto } from "src/database/users/user.dto";
import * as bcrypt from 'bcryptjs';
import { User } from "./user.entity";
import { UpdateUserDto } from "src/database/users/updateUser.dto";
import { CreateUserDto } from "src/database/users/createUser.dto";

@Injectable()
export class UsersService {
    constructor (private usersRepository: UsersRepository) {}

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

    async createUser(createUserDto: CreateUserDto & { admin?: boolean }): Promise<User> {
        const newUser = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: await bcrypt.hash(createUserDto.password, 10),
            address: createUserDto.address,
            phone: createUserDto.phone,
            country: createUserDto.country,
            city: createUserDto.city,
            admin: createUserDto.admin || false
        };

        return this.usersRepository.createUser(newUser);
    }

    async updateUser(id: string, updatedUser: UpdateUserDto):Promise<User> {
        return this.usersRepository.updateUser(id, updatedUser);
    }

    async deleteUser(id: string): Promise<string> {
        await this.usersRepository.deleteUser(id)
        return id;
    }
}