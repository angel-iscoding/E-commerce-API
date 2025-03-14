import { Body, Controller, Delete, Get, Param, Put, NotFoundException, Query, UseGuards, UseInterceptors, Req, BadRequestException, Request } from '@nestjs/common';
import { UsersService } from 'src/user-management/users/user.service';
import { PaginationQueryDto } from 'src/database/pagination-query.dto'; 
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/config/role.decorator';
import { Role } from '../../config/role.enum';
import { DateAdderInterceptor } from 'src/utils/interceptors/date-adder.interceptor';
import { User } from './user.entity';
import { UserDto } from 'src/database/users/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { idParamDto } from 'src/database/idParamDto.dto';
import { Request as ExpressRequest } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth()
    async getAllUsers(@Query() paginationQuery: PaginationQueryDto): Promise<Omit<User[], 'password'>[]> {
        const { page, limit } = paginationQuery;
        return await this.usersService.getAllUsers(page, limit);
    }

    @Get(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getUserById(@Param() params: idParamDto): Promise<Omit<User, 'password'> | undefined> {
        const user = await this.usersService.getUserById(params.id);
        
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        return user;
    }

    @Put('put/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async updateUser(@Request() req: ExpressRequest , @Body() userDto: UserDto): Promise<{ message: string }> {
        try {
            const updatedUser: User = await this.usersService.updateUser(req.user.id, userDto);
            return { message: updatedUser.id };
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el usuario: ' + error.message);
        }
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(DateAdderInterceptor)
    @ApiBearerAuth()
    async deleteUser(@Request() req: ExpressRequest): Promise<{ message: string }> {
        try {
            await this.usersService.deleteUser(req.user.id);
            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            throw new BadRequestException('No se pudo eliminar el usuario: ' + error.message);
        }
    }
}