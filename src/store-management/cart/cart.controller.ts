import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Controller('cart')

export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async GetAllCart(): Promise<Cart[]> {
        return await this.cartService.getAllCart();
    }
}
