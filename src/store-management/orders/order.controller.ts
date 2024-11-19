import { Body, Controller, Get, Param, Post, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { IsUUID } from 'class-validator';
import { OrderDto } from 'src/database/orders/order.dto';
import { AuthGuard } from '../../auth/auth.guard';

class OrderIdParam {
  @IsUUID()
  id: string;
}

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getAllOrders() {
        return await this.orderService.getAllOrders();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getOrder(@Param() params: OrderIdParam) {
        const order = await this.orderService.getById(params.id);
        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }
        return order;
    }

    @Post('post')
    @UseGuards(AuthGuard)
    async createOrder(@Body() createOrderDto: OrderDto) {
        try {
            return await this.orderService.createOrder(createOrderDto);
        } catch (error) {
            throw new BadRequestException('No se pudo crear la orden: ' + error.message);
        }
    }
}