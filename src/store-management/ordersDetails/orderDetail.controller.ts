import { Controller, Get, Param } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('order-details')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) {}

    @Get()
    async getAllOrdersDetail() {
        return this.orderDetailService.getAllOrdersDetail();
    }

    @Get(':id')
    async getOrderDetailById(@Param('id') id: string) {
        return this.orderDetailService.getOrderDetailById(id);
    }
}