import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/database/users/user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersDbService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  async getUserById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: {id: id}}); 
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: {email: email}}); 
  }

  async createUser(user: UserDto): Promise<User> {
    const thisUserExist = await this.findOneByEmail(user.email);

    if (thisUserExist) {
      return undefined
    }

    const newUser = this.usersRepository.create(user); 
    
    return await this.usersRepository.save(newUser);
  }

  async updateUser(id: string, updateUser: UserDto): Promise<User | undefined> {
    const userToUpdate = await this.getUserById(id);
    if (!userToUpdate) return undefined;

    await this.usersRepository.update(userToUpdate.id, updateUser);    

    return  await this.usersRepository.findOne({ where: { id: id } });
  }

  async deleteUser(id: string): Promise<void> {
    const userToDelete = await this.getUserById(id); 
    if (!userToDelete) return;

    await this.usersRepository.delete(userToDelete); 
  }
}