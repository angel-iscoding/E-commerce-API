import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOperation({ summary: 'Get all carts' })
    @ApiResponse({ status: 200, description: 'List of all shopping carts' })
    async GetAllCart(): Promise<Cart[]> {
        return await this.cartService.getAllCart();
    }
}
