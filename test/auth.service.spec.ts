import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../src/dto/sing-up.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../src/config/role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash the password and create a user', async () => {
      const signUpDto: SignUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        address: 'Test Address',
        phone: 1234567890,
        country: 'Test Country',
        city: 'Test City',
      };

      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);
      jest.spyOn(usersService, 'createUser').mockResolvedValue({
        ...signUpDto,
        password: hashedPassword,
        admin: false,
        id: 'test-id', // Agregar id ficticio
        orders: [], // Agregar orders ficticio
      });

      const result = await authService.signUp(signUpDto);

      expect(result.password).toBeUndefined();
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...signUpDto,
        password: hashedPassword,
      });
    });
  });

  describe('signIn', () => {
    it('should validate user credentials and return a JWT token', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        email,
        password: hashedPassword,
        admin: false,
        id: 'test-id', // Agregar id ficticio
        name: 'Test User', // Agregar name ficticio
        phone: 1234567890, // Agregar phone ficticio
        country: 'Test Country', // Agregar country ficticio
        city: 'Test City', // Agregar city ficticio
        address: 'Test Address', // Agregar address ficticio
        orders: [], // Agregar orders ficticio
      });
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true)); // Usar mockImplementation
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      const result = await authService.signIn(email, password);

      expect(result).toBe('jwt-token');
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email,
        sub: undefined,
        roles: [Role.User],
      });
    });
  });
});
