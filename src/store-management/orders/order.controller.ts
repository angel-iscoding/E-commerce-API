import { Body, Controller, Get, Param, Post, NotFoundException, BadRequestException, UseGuards, Req, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { idParamDto } from 'src/database/idParamDto.dto';
import { Role } from 'src/config/role.enum';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/config/role.decorator';
import { Request as ExpressRequest } from 'express';
import { Order } from './order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth()
    async getAllOrders(): Promise<Order[]> {
        try {
            return await this.orderService.getAllOrders();
        } catch (error) {
            throw new BadRequestException('No se pudo obtener las ordenes: ' + error.message);
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth()
    async getOrder(@Param() params: idParamDto): Promise<{ message: string}> {
        try {
            const order = await this.orderService.getById(params.id);
            if (!order) {
                throw new NotFoundException('Orden no encontrada');
            }
            return { message: `Orden: ${order}` };
        } catch (error) {
            throw new BadRequestException('No se pudo obtener la orden: ' + error.message);
        }
    }

    @Get('orders')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getOrderOfUser(@Request() req: ExpressRequest): Promise< {message: string }> {
        try {
            const orders = await this.orderService.getOrdersOfUser(req.user.id);
            return { message: `Ordenes: ${orders}` };
        } catch (error) {
            throw new BadRequestException('No se pudo obtener las ordenes del usuario: ' + error.message);
        }
        
    }
}