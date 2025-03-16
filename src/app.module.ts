import { Module, OnApplicationBootstrap } from "@nestjs/common"; 
import { UsersModule } from './user-management/users/user.module';
import { ProductsModule } from "./store-management/products/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import typeOrmConfig from "./config/typeorm"
import { CategoriesModule } from "./store-management/categories/category.module";
import { ProductsService } from "./store-management/products/product.service";
import { OrderModule } from "./store-management/orders/order.module";
import { AuthModule } from "./auth/auth.module";
import { CloudModule } from "./cloud/cloud.module";
import { CartModule } from "./store-management/cart/cart.module";
import { PaymentsModule } from "./payments/payments.module"; // Importa el módulo de pagos

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
        CartModule,
        UsersModule,
        AuthModule,
        ProductsModule,
        CategoriesModule,
        OrderModule,
        CloudModule,
        PaymentsModule 
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
