import { BadRequestException, Body, Controller, Delete, Get, Post, Put, UseGuards, Request, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from './cart.entity';
import { cartDto } from 'src/database/cart/cartDto.dto';
import { MigrateCartDto } from 'src/database/cart/migrateCartDto.dto';
import { RemoveFromCartDto } from 'src/database/cart/removeFromCartDto.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Post('add')
    @UseGuards(AuthGuard)
    @ApiOperation({ 
        summary: 'Agregar productos al carrito',
        description: 'Agrega productos al carrito. Si el usuario está autenticado, se guarda en DB, si no, en Redis.'
    })
    @ApiBody({ type: cartDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Productos agregados exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Productos agregados al carrito'
                },
                userId: {
                    type: 'string',
                    example: 'user123'
                },
                isAuthenticated: {
                    type: 'boolean',
                    example: true
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Error al agregar productos' })
    async addToCart(
        @Body() data: cartDto,
        @Request() req
    ): Promise<{ message: string, userId: string, isAuthenticated: boolean }> {
        const isAuthenticated = req.user !== undefined;
        console.log('Finally exits', req.user);
        
        const userId = isAuthenticated ? req.user.id : (uuidv4());

        console.log(userId);

        await this.cartService.addProductToCart(
            userId, 
            data.products, 
            isAuthenticated
        );    

        return { 
            message: 'Productos agregados al carrito',
            userId: userId,
            isAuthenticated: isAuthenticated
        };
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Obtener carrito',
        description: 'Obtiene el carrito. Para usuarios no autenticados, genera un ID temporal si no existe.'
    })
    async getCart(
        @Param('id') idUser: string,
        @Request() req
    ): Promise<any> {
        const isAuthenticated = req.user !== undefined;
        
        const cart: Cart = await this.cartService.getCart(idUser, isAuthenticated);
        
        return {
            cartId: idUser, 
            items: cart.products,
            price: cart.price
        };
    }

    @Post('migrate')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Migrar carrito temporal a permanente',
        description: 'Migra el carrito temporal de Redis a la base de datos cuando un usuario inicia sesión'
    })
    @ApiBody({ type: MigrateCartDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Carrito migrado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { 
                    type: 'string',
                    example: 'Carrito migrado exitosamente'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async migrateCart(
        @Body() data: MigrateCartDto,
        @Request() req
    ): Promise<{ message: string }> {
        await this.cartService.migrateCartToUser(data.temporaryUserId, req.user.id);
        return { message: 'Carrito migrado exitosamente' };
    }

    @Delete('remove')
    @ApiOperation({ 
        summary: 'Remover producto del carrito',
        description: 'Remueve un producto específico del carrito'
    })
    @ApiBody({ type: RemoveFromCartDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto removido exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Producto removido del carrito'
                }
            }
        }
    })
    async removeFromCart(
        @Body() data: RemoveFromCartDto,
        @Request() req
    ): Promise<{ message: string }> {
        const isAuthenticated = req.user !== undefined;
        await this.cartService.removeFromCart(
            data.userId,
            data.productId,
            isAuthenticated
        );
        return { message: 'Producto removido del carrito' };
    }

    @Delete('clear')
    @ApiOperation({ 
        summary: 'Limpiar carrito',
        description: 'Elimina todos los productos del carrito'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                    example: 'user123',
                    description: 'ID del usuario o ID temporal'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Carrito limpiado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Carrito limpiado'
                }
            }
        }
    })
    async clearCart(
        @Body() data: { userId: string },
        @Request() req
    ): Promise<{ message: string }> {
        const isAuthenticated = req.user !== undefined;
        await this.cartService.clearCart(data.userId, isAuthenticated);
        return { message: 'Carrito limpiado' };
    }
}
