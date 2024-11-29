import { Body, Controller, HttpCode, HttpStatus, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/database/auth/sign-up.dto';
import { SignInDto } from 'src/database/auth/sign-in.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
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
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() loginUserDto: SignInDto): Promise<{ access_token: string }> { //Agregar Promise
        const { email, password } = loginUserDto;
        const token = await this.authService.signIn(email, password);
        if (!token) {
            throw new BadRequestException('Email o contraseña incorrectos');
        }
        return { access_token: token };
    }
}