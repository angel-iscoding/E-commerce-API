import { Body, Controller, Get, Param, Post, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { IsUUID } from 'class-validator';
import { cartDto } from 'src/dto/cartDto.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

class OrderIdParam {
  @IsUUID()
  id: string;
}

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener todas las órdenes' })
    @ApiResponse({ status: 200, description: 'Lista de órdenes obtenida exitosamente.' })
    async getAllOrders() {
        return await this.orderService.getAllOrders();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Obtener una orden por ID' })
    @ApiResponse({ status: 200, description: 'Orden obtenida exitosamente.' })
    @ApiResponse({ status: 404, description: 'Orden no encontrada.' })
    async getOrder(@Param() params: OrderIdParam) {
        const order = await this.orderService.getById(params.id);
        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }
        return order;
    }

    @Post('post')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Crear una nueva orden' })
    @ApiResponse({ status: 201, description: 'Orden creada exitosamente.' })
    @ApiResponse({ status: 400, description: 'No se pudo crear la orden.' })
    async createOrder(@Body() createOrderDto: cartDto) {
        try {
            return await this.orderService.createOrder(createOrderDto);
        } catch (error) {
            throw new BadRequestException('No se pudo crear la orden: ' + error.message);
        }
    }
}