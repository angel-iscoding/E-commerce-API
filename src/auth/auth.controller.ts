import { Body, Controller, HttpCode, HttpStatus, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/database/auth/sign-up.dto';
import { SignInDto } from 'src/database/auth/sign-in.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
        try {
            if (signUpDto.password !== signUpDto.confirmPassword) {
                throw new BadRequestException('Las contraseñas no coinciden');
            }
            const user = await this.authService.signUp(signUpDto);
            return { message: user.id}
        } catch (error) {
            throw new BadRequestException('No se pudo crear el usuario. Error: ' + error.message);
        }
    }

    @Post('signin')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful', type: Object })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid credentials' })
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() loginUserDto: SignInDto): Promise<{ access_token: string }> {
        const { email, password } = loginUserDto;
        const token = await this.authService.signIn(email, password);
        if (!token) {
            throw new BadRequestException('Email o contraseña incorrectos');
        }
        return { access_token: token };
    }
}