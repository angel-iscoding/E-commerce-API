import { BadRequestException, Body, Controller, Delete, Get, Post, Put, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

// DTOs para Swagger
class AddToCartDto {
    @ApiProperty({ description: 'ID del usuario o ID temporal', example: 'user123' })
    userId: string;

    @ApiProperty({ 
        description: 'Array de IDs de productos', 
        example: ['product1', 'product2'],
        type: [String]
    })
    productIds: string[];
}

class RemoveFromCartDto {
    @ApiProperty({ description: 'ID del usuario o ID temporal', example: 'user123' })
    userId: string;

    @ApiProperty({ description: 'ID del producto a remover', example: 'product123' })
    productId: string;
}

class MigrateCartDto {
    @ApiProperty({ 
        description: 'ID temporal del usuario no autenticado', 
        example: 'temp123' 
    })
    temporaryUserId: string;
}

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @Put('add')
    @ApiOperation({ 
        summary: 'Agregar productos al carrito',
        description: 'Agrega productos al carrito. Si el usuario está autenticado, se guarda en DB, si no, en Redis.'
    })
    @ApiBody({ type: AddToCartDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Productos agregados exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Productos agregados al carrito'
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Error al agregar productos' })
    async addToCart(
        @Body() data: AddToCartDto,
        @Request() req
    ): Promise<{ message: string }> {
        try {
            const isAuthenticated = req.user !== undefined;
            await this.cartService.addProductToCart(
                data.userId, 
                data.productIds, 
                isAuthenticated
            );
            return { 
                message: isAuthenticated 
                    ? 'Productos agregados al carrito permanente' 
                    : 'Productos agregados al carrito temporal'
            };
        } catch (error) {
            throw new BadRequestException('Error al agregar productos: ' + error.message);
        }
    }

    @Get()
    @ApiOperation({ 
        summary: 'Obtener carrito',
        description: 'Obtiene el carrito del usuario. Si está autenticado, de DB, si no, de Redis.'
    })
    @ApiQuery({ 
        name: 'temporaryUserId', 
        required: false, 
        description: 'ID temporal para usuarios no autenticados'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Carrito obtenido exitosamente',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            productId: { type: 'string' },
                            quantity: { type: 'number' }
                        }
                    }
                }
            }
        }
    })
    async getCart(@Request() req): Promise<any> {
        const isAuthenticated = req.user !== undefined;
        const userId = isAuthenticated ? req.user.id : req.query.temporaryUserId;
        return await this.cartService.getCart(userId, isAuthenticated);
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
