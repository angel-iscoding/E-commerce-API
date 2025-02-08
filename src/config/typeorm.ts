import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions, Migration } from "typeorm";

const config = {
    type: 'postgres',
    database: process.env.DATABASE_NAME || 'demodb',
    host: process.env.DATABASE_HOST || 'db',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'admin',
    autoLoadEntities: true,
    synchronize: true,
    dropSchema: true, // Cambia esto a false para evitar perder datos en cada reinicio
    logging: false, // Cambia esto a true para ver los logs de SQL
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.js,.ts}'],
}

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);