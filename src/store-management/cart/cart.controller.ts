import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DateAdderInterceptor } from 'src/utils/interceptors/date-adder.interceptor';
import { UsersService } from 'src/user-management/users/user.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly usersService: UsersService
    
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all carts' })
    @ApiResponse({ status: 200, description: 'List of all shopping carts' })
    async getAllCart(): Promise<Cart[]> {
        return await this.cartService.getAllCart();
    }

    @Get(':id')
    async getCart(@Param() id: string): Promise<Cart> {
        return await this.cartService.getCart(id);
    }

    @Put('add')
    @UseGuards(AuthGuard)
    @UseInterceptors(DateAdderInterceptor)
    @ApiOperation({ summary: 'Agregar un producto al carrito del usuario' })
    @ApiResponse({ status: 200, description: 'Producto agregado exitosamente' })
    @ApiResponse({ status: 400, description: 'Error al agregar el producto' })
    async addProduct(@Body() id: string, productId: string[]): Promise<{message: string}> {
        try {
            const cart = await this.cartService.addProductToUserCart(id, productId);
            return { message: cart.id }
        } catch (error) {
            throw new BadRequestException('No se pudo hacer la solicitud' + error.message);
        }
    }

    /* @Delete('delete')
    async deleteProduct(@Body() id: string, productId: string[]): Promise<{ message: string }> {
        try {
            const cart = await this.cartService.deleteProductOfUserCart(id, productId);
            return { message: cart.id }
        } catch (error) {
            throw new BadRequestException('No se pudo hacer la solicitud' + error.message);
        }
    } */
}
