import { Module } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { ProductsController } from "./product.controller";
import { ProductsRepository } from "./product.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { CategoriesModule } from "../categories/category.module";
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from "src/modules/auth/auth.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        CategoriesModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [ProductsService, ProductsRepository, AuthGuard],
    controllers: [ProductsController],
    exports: [ProductsService, ProductsRepository]
})
export class ProductsModule {
}