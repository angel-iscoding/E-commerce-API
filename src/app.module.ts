import { Module, OnApplicationBootstrap } from "@nestjs/common"; 
import { UsersModule } from './user-management/users/user.module';
import { ProductsModule } from "./store-management/products/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import typeOrmConfig from "./config/typeorm"
import { CategoriesModule } from "./store-management/categories/category.module";
import { CategoriesService } from "./store-management/categories/category.service";
import { ProductsService } from "./store-management/products/product.service";
import { OrderModule } from "./store-management/orders/order.module";
import { OrderDetailModule } from "./store-management/ordersDetails/orderDetail.module"; 
import { AuthModule } from "./auth/auth.module";
import { CloudModule } from "./cloud/cloud.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.development',
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
        /* private readonly categoriesService: CategoriesService, */
        private readonly productsService: ProductsService,
    ) {}

    async onApplicationBootstrap() {
        try {
           /*  await this.categoriesService.preloadCategories(); */
            await this.productsService.preloadProducts();
        } catch (error) {
            console.error('Error durante precarga de datos', error);
        }
    }
}
