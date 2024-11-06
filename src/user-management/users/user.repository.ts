import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from './user.entity';
import { UserDto } from "src/database/users/user.dto";
import { UpdateUserDto } from "src/database/users/updateUser.dto";
import { CreateUserDto } from "src/database/users/createUser.dto";

@Injectable()
export class UsersRepository {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private users: any[] = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'John Doe',
          password: 'password123',
          address: '123 Main St',
          phone: '555-123-4567',
          country: 'United States',
          city: 'New York',
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'Jane Smith',
          password: 'securepass',
          address: '456 Elm St',
          phone: '555-987-6543',
          country: 'Canada',
          city: 'Toronto',
        },
        {
          id: '3',
          email: 'user3@example.com',
          name: 'Alice Johnson',
          password: 'pass123',
          address: '789 Oak St',
          phone: '555-555-5555',
          country: 'United Kingdom',
          city: 'London',
        },
        {
          id: '4',
          email: 'user4@example.com',
          name: 'Bob Brown',
          password: 'bobbob',
          address: '101 Pine St',
          phone: '555-111-2222',
          country: 'Australia',
          city: 'Sydney',
        },
        {
          id: '5',
          email: 'user5@example.com',
          name: 'Eva Garcia',
          password: 'evaeva',
          address: '222 Maple St',
          phone: '555-333-4444',
          country: 'Spain',
          city: 'Madrid',
        },
        {
          id: '6',
          email: 'user6@example.com',
          name: 'Carlos Rodriguez',
          password: 'carlos123',
          address: '333 Birch St',
          phone: '555-666-7777',
          country: 'Mexico',
          city: 'Mexico City',
        },
        {
          id: '7',
          email: 'user7@example.com',
          name: 'Linda Lee',
          password: 'lindalinda',
          address: '444 Cedar St',
          phone: '555-888-9999',
          country: 'Canada',
          city: 'Vancouver',
        },
        {
          id: '8',
          email: 'user8@example.com',
          name: 'David Kim',
          password: 'david123',
          address: '555 Walnut St',
          phone: '555-444-3333',
          country: 'South Korea',
          city: 'Seoul',
        },
        {
          id: '9',
          email: 'user9@example.com',
          name: 'Maria Hernandez',
          password: 'maria456',
          address: '666 Oak St',
          phone: '555-777-8888',
          country: 'Argentina',
          city: 'Buenos Aires',
        },
        {
          id: '10',
          email: 'user10@example.com',
          name: 'Alexandre Dupont',
          password: 'alex123',
          address: '777 Elm St',
          phone: '555-222-1111',
          country: 'France',
          city: 'Paris',
        },
  ];

  async getAllUsers(page: number = 1, limit: number = 5): Promise<Omit<User[], 'password'>[]>   {
    const users: User[] = await this.usersRepository.find(); 

    const pages = []

        for (let i = page; i < page+1; i++) {
            const skip = (i - 1) * limit;
            const section = users.slice(skip, skip + limit);

            pages.push({page: i, content: section})
        }
    
    return pages; 
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: {id: id}}); 
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: {email: email}}); 
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const thisUserExist = await this.findOneByEmail(user.email);

    if (thisUserExist) {
      throw new InternalServerErrorException('El usuario ya fue registrado')
    }

    const newUser = this.usersRepository.create(user); 
    
    return await this.usersRepository.save(newUser);
  }

  async updateUser(id: string, updateUser: UpdateUserDto): Promise<User | null> {
    const userToUpdate = await this.getUserById(id);
    if (!userToUpdate) throw new NotFoundException('Usuario no encontrado');

    await this.usersRepository.update(userToUpdate.id, updateUser);    

    return  await this.usersRepository.findOne({ where: { id: id } });
  }

  async deleteUser(id: string): Promise<void> {
    const userToDelete = await this.getUserById(id); 
    if (!userToDelete) return undefined;

    await this.usersRepository.delete(userToDelete); 
  }
}