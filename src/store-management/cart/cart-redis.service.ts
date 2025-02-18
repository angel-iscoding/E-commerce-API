import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Product } from '../products/product.entity';
import { Cart } from './cart.entity';
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
        const newCart: Cart = {
            id: cartId,
            price: 0,
            products: [],
            user: null
        };
        
        await this.redis.set(
            this.getCartKey(cartId),
            JSON.stringify(newCart),
            'EX',
            this.EXPIRATION_TIME
        );
        return cartId;
    }

    async getTemporaryCart(cartId: string): Promise<Cart> {
        const cartKey = this.getCartKey(cartId);
        const cart = await this.redis.get(cartKey);
        if (!cart) {
            return {
                id: cartId,
                price: 0,
                products: [],
                user: null
            };
        }
        return JSON.parse(cart) as Cart;
    }

    async updateTemporaryCart(cartId: string, products: Product[]): Promise<void> {
        const cartKey = this.getCartKey(cartId);
        const existingCart = await this.getTemporaryCart(cartId);
        const cart: Cart = {
            ...existingCart,
            products: products,
            price: products.reduce((sum, product) => sum + Number(product.price), 0)
        };
        
        await this.redis.set(
            cartKey,
            JSON.stringify(cart),
            'EX',
            this.EXPIRATION_TIME
        );
    }

    async addToTemporaryCart(cartId: string, products: Product[]): Promise<void> {
        const cartKey = this.getCartKey(cartId);
        const existingCart = await this.getTemporaryCart(cartId);
        
        const updatedProducts = [...existingCart.products, ...products];
        const updatedCart: Cart = {
            ...existingCart,
            products: updatedProducts,
            price: updatedProducts.reduce((sum, product) => sum + Number(product.price), 0)
        };
        
        await this.redis.set(
            cartKey,
            JSON.stringify(updatedCart),
            'EX',
            this.EXPIRATION_TIME
        );
    }

    async removeTemporaryCart(cartId: string): Promise<void> {
        const cartKey = this.getCartKey(cartId);
        await this.redis.del(cartKey);
    }
}
