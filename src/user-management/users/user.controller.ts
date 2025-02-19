import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, Query, UseGuards, UseInterceptors, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/user-management/users/user.service';
import { PaginationQueryDto } from 'src/database/pagination-query.dto'; 
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/config/role.decorator';
import { Role } from '../../config/role.enum';
import { DateAdderInterceptor } from 'src/utils/interceptors/date-adder.interceptor';
import { User } from './user.entity';
import { IsUUID } from 'class-validator';
import { AuthService } from '../../auth/auth.service';
import { UserDto } from 'src/database/users/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { UserIdParam } from 'src/database/users/userIdParam.dto';
// import { SignUpDto } from 'src/database/sing-up.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    @ApiOperation({ 
        summary: 'Obtener todos los usuarios',
        description: 'Retorna una lista paginada de usuarios. Solo accesible por administradores.'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página para la paginación',
        type: Number
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de elementos por página',
        type: Number
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de usuarios obtenida exitosamente',
        type: [User]
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado - Token no válido o expirado' 
    })
    @ApiResponse({ 
        status: 403, 
        description: 'Prohibido - Se requieren permisos de administrador' 
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllUsers(@Query() paginationQuery: PaginationQueryDto): Promise<Omit<User[], 'password'>[]> {
        const { page, limit } = paginationQuery;
        return this.usersService.getAllUsers(page, limit);
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Obtener usuario por ID',
        description: 'Retorna la información de un usuario específico excluyendo la contraseña'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del usuario a buscar',
        type: String
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario encontrado exitosamente',
        type: User
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Usuario no encontrado' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado - Token no válido o expirado' 
    })
    @UseGuards(AuthGuard)
    async getUserById(@Param() params: UserIdParam): Promise<Omit<User, 'password'> | undefined> {
        const user = await this.usersService.getUserById(params.id);
        
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        return user;
    }

    @Put('put/:id')
    @ApiOperation({ 
        summary: 'Actualizar usuario',
        description: 'Actualiza la información de un usuario existente'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del usuario a actualizar'
    })
    @ApiBody({ 
        type: UserDto,
        description: 'Datos actualizados del usuario'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario actualizado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Solicitud inválida - Datos incorrectos' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado' 
    })
    @UseGuards(AuthGuard)
    async updateUser(@Param() params: UserIdParam, @Body() userDto: UserDto): Promise<{ message: string }> {
        try {
            const updatedUser: User = await this.usersService.updateUser(params.id, userDto);
            return { message: updatedUser.id };
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el usuario: ' + error.message);
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ 
        summary: 'Eliminar usuario',
        description: 'Elimina permanentemente un usuario del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del usuario a eliminar'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Usuario eliminado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Usuario eliminado correctamente'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Error al eliminar el usuario' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado' 
    })
    @UseGuards(AuthGuard)
    @UseInterceptors(DateAdderInterceptor)
    async deleteUser(@Param() params: UserIdParam): Promise<{ message: string }> {
        try {
            await this.usersService.deleteUser(params.id);
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new BadRequestException('No se pudo eliminar el usuario: ' + error.message);
        }
    }
}