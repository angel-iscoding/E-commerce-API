import { registerAs } from "@nestjs/config";
import { config as dotennvConfig } from "dotenv";
import { DataSource, DataSourceOptions, Migration } from "typeorm";

const config = {
    type: 'postgres',
    database: 'demodb',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    autoLoadEntities: true,
    synchronize: true,
    dropSchema: false, // Cambia esto a false para evitar perder datos en cada reinicio
    logging: true, // Cambia esto a true para ver los logs de SQL
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
}

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);