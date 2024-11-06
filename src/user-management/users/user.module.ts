import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";
import { UsersRepository } from "./user.repository";
import { AuthGuard } from "src/auth/auth.guard";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';

/* const mockUserService = {
    getUsers: () => 'Esto es un servicio mock de usuarios',
}; */

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
        forwardRef(() => AuthModule)
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