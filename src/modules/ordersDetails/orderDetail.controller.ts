import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('order-details')
@Controller('order-details')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los detalles de órdenes' })
    @ApiResponse({ status: 200, description: 'Lista de detalles de órdenes obtenida exitosamente.' })
    async getAllOrdersDetail() {
        return this.orderDetailService.getAllOrdersDetail();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener detalle de orden por ID' })
    @ApiParam({ name: 'id', description: 'ID del detalle de orden' })
    @ApiResponse({ status: 200, description: 'Detalle de orden obtenido exitosamente.' })
    @ApiResponse({ status: 404, description: 'Detalle de orden no encontrado.' })
    async getOrderDetailById(@Param('id') id: string) {
        return this.orderDetailService.getOrderDetailById(id);
    }
}