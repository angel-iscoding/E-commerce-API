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

    // Habilitar CORS
    app.enableCors({
        origin: 'http://127.0.0.1:8080', // Permitir solo este origen
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Si necesitas enviar cookies o encabezados de autorización
    });

    await app.listen(process.env.PORT || 3000);
}

bootstrap();