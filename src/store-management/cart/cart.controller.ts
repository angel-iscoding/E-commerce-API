import { BadRequestException, Body, Controller, Delete, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from './cart.entity';
import { cartDto } from 'src/database/cart/cartDto.dto';
import { MigrateCartDto } from 'src/database/cart/migrateCartDto.dto';
import { Request as ExpressRequest } from 'express';
import { idParamDto } from 'src/database/idParamDto.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Post('add')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async addToCart( @Body() data: cartDto, @Request() req: ExpressRequest ): Promise<{ message: string, id: string }> {
        const isAuthenticated: boolean = req.user ? true : false;
        const userId: string = isAuthenticated ? req.user.id : uuidv4() ;

        await this.cartService.addProductToCart(
            userId, 
            data.products, 
            isAuthenticated
        );    

        if (isAuthenticated) {
            return { 
                message: `Productos: ${data.products}. Agregados al carrito del usuario.`,
                id: userId,
            };
        }
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async getCart( @Body() user: idParamDto, @Request() req: ExpressRequest ): Promise<{ message: string, id: string, cart: Cart }> { 
        const isAuthenticated: boolean = req.user ? true : false;
        const idUser: string = isAuthenticated ? req.user.id : user.id;

        const cart: Cart = await this.cartService.getCart(idUser, isAuthenticated);
        
        return {
            message: `Carrito ${isAuthenticated ? '' : 'de usuario no autentificado '}obtenido con exito`,
            id: idUser,
            cart: cart,
        };
    }

    @Post('process')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    async buyCart ( @Request() req: ExpressRequest ): Promise<{ message: string, id: string }> {
        const isAuthenticated: boolean = req.user ? true : false;

        if (!isAuthenticated) throw new BadRequestException('No se puede comprar sin iniciar sesión');
        const userId: string = req.user.id; 

        if(await this.cartService.buyCart(userId)) {
            return {
                message: 'Compra realizada con exito',
                id: userId,
            }
        } else {
            throw new BadRequestException('No se pudo realizar la compra');
        }
        
    }

    @Post('migrate')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async migrateCart( @Body() data: MigrateCartDto, @Request() req: ExpressRequest ): Promise<{ message: string }> {
        const isAuthenticated: boolean = req.user ? true : false;
        
        if (!isAuthenticated) throw new BadRequestException('El usuario debe estar logeado para hacer esta peticion.') 
        
        const userId: string = req.user.id;

        await this.cartService.migrateCartToUser(data.temporaryUserId, userId);
        return { message: 'Carrito migrado exitosamente' };
    }

    @Delete('remove')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async removeFromCart( @Body() data: idParamDto, @Request() req: ExpressRequest ): Promise<{ message: string }> {
        const isAuthenticated: boolean = req.user ? true : false;

        if (!isAuthenticated) throw new BadRequestException('El usuario debe estar logeado para hacer esta peticion.') 
        
        const userId: string = req.user.id;

        await this.cartService.removeFromCart(
            userId,
            data.id,
            isAuthenticated
        );
        return { message: 'Producto removido del carrito' };
    }

    @Delete('clear')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async clearCart( @Request() req: ExpressRequest ): Promise<{ message: string }> {
        const isAuthenticated: boolean = req.user ? true : false;

        if (!isAuthenticated) throw new BadRequestException('El usuario debe estar logeado para hacer esta peticion.') 
        
        const userId: string = req.user.id;


        await this.cartService.clearCart(userId, isAuthenticated);
        return { message: 'Carrito limpiado' };
    }
}
