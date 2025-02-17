import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Product } from '../products/product.entity';
import { v4 as uuidv4 } from 'uuid';

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

    private getCartKey(cartId: string): string {
        return `cart:${cartId}`;
    }

    async createTemporaryCart(): Promise<string> {
        const cartId = uuidv4();
        await this.redis.set(
            this.getCartKey(cartId),
            JSON.stringify([]),
            'EX',
            this.EXPIRATION_TIME
        );
        return cartId;
    }

    async addToTemporaryCart(cartId: string, products: Product[]): Promise<void> {
        const cartKey = this.getCartKey(cartId);
        const existingCart = await this.getTemporaryCart(cartId);
        
        // Combinar productos existentes con nuevos
        const updatedProducts = [...existingCart, ...products];
        
        await this.redis.set(
            cartKey,
            JSON.stringify(updatedProducts),
            'EX',
            this.EXPIRATION_TIME
        );
    }

    async getTemporaryCart(cartId: string): Promise<Product[]> {
        const cartKey = this.getCartKey(cartId);
        const cart = await this.redis.get(cartKey);
        return cart ? JSON.parse(cart) : [];
    }

    async removeTemporaryCart(cartId: string): Promise<void> {
        const cartKey = this.getCartKey(cartId);
        await this.redis.del(cartKey);
    }

    async updateTemporaryCart(cartId: string, products: Product[]): Promise<void> {
        await this.addToTemporaryCart(cartId, products);
    }
}
