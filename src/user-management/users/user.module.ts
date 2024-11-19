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

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        forwardRef(() => AuthModule),
        forwardRef(() => OrderModule),
        CartModule
    ],
    providers: [
        UsersService,
        UsersRepository,
        AuthGuard
    ],
    controllers: [UsersController],
    exports: [UsersRepository, UsersService, JwtModule]
})

export class UsersModule {}