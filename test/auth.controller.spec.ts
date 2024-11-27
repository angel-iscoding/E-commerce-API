import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { SignUpDto } from '../src/database/auth/sign-up.dto';
import { LoginUserDto } from '../src/database/users/login-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp with correct parameters', async () => {
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

      const result = { ...signUpDto, password: undefined };
      jest.spyOn(authService, 'signUp').mockResolvedValue(result);

      expect(await authController.signUp(signUpDto)).toEqual(result);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const token = 'jwt-token';
      jest.spyOn(authService, 'signIn').mockResolvedValue(token);

      expect(await authController.signIn(loginUserDto)).toEqual({ access_token: token });
      expect(authService.signIn).toHaveBeenCalledWith(loginUserDto.email, loginUserDto.password);
    });
  });
});
