import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/user-management/users/user.module';
import { UsersService } from '../src/user-management/users/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user-management/users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersModule', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([User]), UsersModule],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.name = 'Test User';
      user.email = 'test@example.com';
      user.password = 'Password123!';
      user.address = 'Test Address';
      user.phone = 1234567890;
      user.country = 'Test Country';
      user.city = 'Test City';
      user.admin = false;

      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await usersService.createUser(user);

      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
