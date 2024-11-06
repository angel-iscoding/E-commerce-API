import { Body, Controller, HttpCode, HttpStatus, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/database/sing-up.dto';
import { LoginUserDto } from 'src/database/users/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Las contraseñas no coinciden o datos inválidos.' })
    async signUp(@Body() signUpDto: SignUpDto) {
        if (signUpDto.password !== signUpDto.confirmPassword) {
            throw new BadRequestException('Las contraseñas no coinciden');
        }
        const user = await this.authService.signUp(signUpDto);
        return { ...user, password: undefined };
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
    @ApiResponse({ status: 400, description: 'Email o contraseña incorrectos.' })
    async signIn(@Body() loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const token = await this.authService.signIn(email, password);
        if (!token) {
            throw new BadRequestException('Email o contraseña incorrectos');
        }
        return { access_token: token };
    }
}