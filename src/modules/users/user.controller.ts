import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, Query, UseGuards, UseInterceptors, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/user.service';
import { CreateUserDto } from 'src/dto/users/createUser.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto'; 
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/config/role.decorator';
import { Role } from '../../config/role.enum';
import { DateAdderInterceptor } from 'src/interceptors/date-adder.interceptor';
import { User } from './user.entity';
import { IsUUID } from 'class-validator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from 'src/dto/sing-up.dto';

class UserIdParam {
  @IsUUID()
  id: string;
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
    async getAllUsers(@Query() paginationQuery: PaginationQueryDto): Promise<Omit<User[], 'password'>[]> {
        const { page, limit } = paginationQuery;
        return this.usersService.getAllUsers(page, limit);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async getUserById(@Param() params: UserIdParam): Promise<Omit<User, 'password'> | undefined> {
        const user = await this.usersService.getUserById(params.id);
        
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        return user;
    }

    @Post('post')
    @UseInterceptors(DateAdderInterceptor)
    async createUser(@Body() user: CreateUserDto, @Req() request): Promise<{ id: string}> {
        try {
            const newUser: User = await this.usersService.createUser(user);
            console.log(request.now, '| ¡Nuevo usuario creado!: \n');
            console.log(
                "Información del usuario:\n" +
                "  Email: " + newUser.email + "\n" +
                "  Nombre: " + newUser.name + "\n" +
                "  Dirección: " + newUser.address + "\n" +
                "  Teléfono: " + newUser.phone + "\n" +
                "  País: " + newUser.country + "\n" +
                "  Ciudad: " + newUser.city
            );
            return { id: newUser.id };
        } catch (error) {
            throw new BadRequestException('No se pudo crear el usuario: ' + error.message);
        }
    }

    @Put('put/:id')
    @UseGuards(AuthGuard)
    async updateUser(@Param() params: UserIdParam, @Body() userDto: CreateUserDto): Promise<{ id: string }> {
        try {
            const updatedUser = await this.usersService.updateUser(params.id, userDto);
            return { id: updatedUser.id };
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el usuario: ' + error.message);
        }
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param() params: UserIdParam): Promise<{ message: string }> {
        try {
            await this.usersService.deleteUser(params.id);
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new BadRequestException('No se pudo eliminar el usuario: ' + error.message);
        }
    }
}