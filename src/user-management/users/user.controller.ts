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
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { SignUpDto } from 'src/database/sing-up.dto';

class UserIdParam {
  @IsUUID()
  id: string;
}

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllUsers(@Query() paginationQuery: PaginationQueryDto): Promise<Omit<User[], 'password'>[]> {
        const { page, limit } = paginationQuery;
        return this.usersService.getAllUsers(page, limit);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserById(@Param() params: UserIdParam): Promise<Omit<User, 'password'> | undefined> {
        const user = await this.usersService.getUserById(params.id);
        
        if (!user) throw new NotFoundException('Usuario no encontrado');
    
        return user;
    }

    @Put('put/:id')
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