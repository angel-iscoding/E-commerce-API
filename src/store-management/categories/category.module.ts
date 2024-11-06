import { Module } from "@nestjs/common";
import { CategoriesService } from "./category.service";
import { CategoriesController } from "./category.controller";
import { CategoriesRepository } from "./category.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category])
    ],
    providers: [CategoriesService, CategoriesRepository],
    controllers: [CategoriesController],
    exports: [CategoriesService, CategoriesRepository]
})

export class CategoriesModule {}
