import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartController } from "./cart.controller";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { UsersModule } from "src/user-management/users/user.module";
import { ProductsModule } from "../products/product.module";
import { CartRedisService } from "./cart-redis.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart]),
        ProductsModule,
        forwardRef(() => UsersModule)
    ],
    providers: [
        CartService, 
        CartRepository,
        CartRedisService
    ],
    controllers: [CartController],
    exports: [
        CartService, 
        CartRepository,
    ],
})

export class CartModule {}