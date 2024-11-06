import { forwardRef, Module } from '@nestjs/common';
import { OrderDetailService } from './orderDetail.service';
import { OrderDetailController } from './orderDetail.controller';
import { OrderDetail } from './orderDetail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailRepository } from './orderDetail.repository';
import { OrderModule } from '../orders/order.module';
import { ProductsModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail]),
    ProductsModule, 
    forwardRef(() => OrderModule)
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderDetailRepository],
  exports: [OrderDetailService, OrderDetailRepository]
})
export class OrderDetailModule {}