import { Body, Controller, Get, Param, Post, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { IsUUID } from 'class-validator';
import { OrderDto } from 'src/database/orders/order.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

class OrderIdParam {
  @IsUUID()
  id: string;
}

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({ status: 200, description: 'List of orders retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard)
    async getAllOrders() {
        return await this.orderService.getAllOrders();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID' })
    @ApiResponse({ status: 200, description: 'Order found successfully' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    @UseGuards(AuthGuard)
    async getOrder(@Param() params: OrderIdParam) {
        const order = await this.orderService.getById(params.id);
        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }
        return order;
    }

    @Post('post')
    @ApiOperation({ summary: 'Create new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
    @UseGuards(AuthGuard)
    async createOrder(@Body() createOrderDto: OrderDto) {
        try {
            return await this.orderService.createOrder(createOrderDto);
        } catch (error) {
            throw new BadRequestException('No se pudo crear la orden: ' + error.message);
        }
    }
}