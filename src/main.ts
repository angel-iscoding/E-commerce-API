import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { loggerGlobal } from "./utils/middlewares/logger.middleware";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    console.log(process.env.PORT)
    const app = await NestFactory.create(AppModule);
    app.use(loggerGlobal);
    const config = new DocumentBuilder()
        .setTitle('Ecommerce API')
        .setDescription('API para la aplicación de ecommerce')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
}

bootstrap();