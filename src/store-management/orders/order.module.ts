import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { UsersModule } from '../../user-management/users/user.module';
import { ProductsModule } from '../products/product.module';
import { CartModule } from '../cart/cart.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        forwardRef(() => UsersModule),
        forwardRef(() => CartModule),
        ProductsModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderService, OrderRepository]
})
export class OrderModule {} 