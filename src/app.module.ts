import { Module, OnApplicationBootstrap } from "@nestjs/common"; 
import { UsersModule } from './modules/users/user.module';
import { ProductsModule } from "./modules/products/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import typeOrmConfig from "./config/typeorm"
import { CategoriesModule } from "./modules/categories/category.module";
import { CategoriesService } from "./modules/categories/category.service";
import { ProductsService } from "./modules/products/product.service";
import { OrderModule } from "./modules/orders/order.module";
import { OrderDetailModule } from "./modules/ordersDetails/orderDetail.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CloudModule } from "./modules/cloud/cloud.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (ConfigService: ConfigService) =>
                ConfigService.get('typeorm')
        }),
        UsersModule,
        AuthModule,
        ProductsModule,
        CategoriesModule,
        OrderModule,
        OrderDetailModule,
        CloudModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule implements OnApplicationBootstrap {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly productsService: ProductsService,
    ) {}

    async onApplicationBootstrap() {
        try {
            await this.categoriesService.preloadCategories();
            await this.productsService.preloadProducts();
        } catch (error) {
            console.error('Error durante precarga de datos', error);
        }
    }
}
