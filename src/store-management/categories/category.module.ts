import { Module } from "@nestjs/common";
import { CategoriesService } from "./category.service";
import { CategoriesController } from "./category.controller";
import { CategoriesRepository } from "./category.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "src/auth/auth.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        JwtModule.register({
            secret: process.env.JTW_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [CategoriesService, CategoriesRepository, AuthGuard],
    controllers: [CategoriesController],
    exports: [CategoriesService, CategoriesRepository]
})

export class CategoriesModule {}
