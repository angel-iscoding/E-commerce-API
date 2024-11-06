import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { UsersModule } from '../users/user.module';
import { OrderDetailModule } from '../ordersDetails/orderDetail.module';
import { ProductsModule } from '../products/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        UsersModule,
        ProductsModule,
        forwardRef(() => OrderDetailModule)
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderService, OrderRepository]
})
export class OrderModule {} 