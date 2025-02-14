import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";
import { UsersRepository } from "./user.repository";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { OrderModule } from '../../store-management/orders/order.module';
import { CartModule } from '../../store-management/cart/cart.module';
import { ProductsModule } from "src/store-management/products/product.module";
import { OrderRepository } from "src/store-management/orders/order.repository";
import { CartRepository } from "src/store-management/cart/cart.repository";
import { Order } from "src/store-management/orders/order.entity";
import { Cart } from "src/store-management/cart/cart.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order, Cart]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        forwardRef(() => AuthModule),
        forwardRef(() => ProductsModule),
        forwardRef(() => OrderModule),    
        forwardRef(() => CartModule),     
    ],
    providers: [
        UsersService,
        UsersRepository,
        OrderRepository,
        CartRepository,
        AuthGuard
    ],
    controllers: [UsersController],
    exports: [
        UsersRepository,
        UsersService,
        JwtModule,
        OrderRepository,
        CartRepository
    ]
})

export class UsersModule {}