import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Product } from '../products/product.entity';

@Injectable()
export class CartRedisService implements OnModuleInit {
    private readonly redis: Redis;
    private readonly logger = new Logger(CartRedisService.name);
    private readonly EXPIRATION_TIME = 60 * 60 * 24; // 24 horas en segundos

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableReadyCheck: true,
            maxRetriesPerRequest: null,
            reconnectOnError: (err) => {
                const targetError = 'READONLY';
                if (err.message.includes(targetError)) {
                    return true;
                }
                return false;
            },
        });

        this.redis.on('error', (error) => {
            this.logger.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            this.logger.log('Successfully connected to Redis');
        });
    }

    async onModuleInit() {
        try {
            await this.redis.ping();
            this.logger.log('Redis connection verified');
        } catch (error) {
            this.logger.error('Failed to connect to Redis:', error);
        }
    }

    private getCartKey(userId: string): string {
        return `cart:${userId}`;
    }

    async addToTemporaryCart(userId: string, products: Product[]): Promise<void> {
        const cartKey = this.getCartKey(userId);
        
        // Guardar productos en Redis
        await this.redis.set(
            cartKey,
            JSON.stringify(products),
            'EX',
            this.EXPIRATION_TIME
        );
    }

    async getTemporaryCart(userId: string): Promise<Product[]> {
        const cartKey = this.getCartKey(userId);
        const cart = await this.redis.get(cartKey);
        return cart ? JSON.parse(cart) : [];
    }

    async removeTemporaryCart(userId: string): Promise<void> {
        const cartKey = this.getCartKey(userId);
        await this.redis.del(cartKey);
    }

    async updateTemporaryCart(userId: string, products: Product[]): Promise<void> {
        await this.addToTemporaryCart(userId, products);
    }
}
