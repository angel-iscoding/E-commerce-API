import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards, UseInterceptors, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/database/products/product.dto";
import { Roles } from 'src/config/role.decorator';
import { Role } from 'src/config/role.enum';
import { RolesGuard } from "../../auth/roles.guard";
import { Product } from "./product.entity";
import { IsUUID } from "class-validator";
import { DateAdderInterceptor } from "src/utils/interceptors/date-adder.interceptor";
import { PaginationQueryDto } from "src/database/pagination-query.dto";
import { ApiProperty } from "@nestjs/swagger";

class ProductIdParam {
    @ApiProperty({
        description: 'UUID del producto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    id: string;
}

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Get()
    @ApiOperation({ 
        summary: 'Obtener todos los productos',
        description: 'Retorna una lista paginada de productos disponibles en la tienda.'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página para la paginación',
        type: Number
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de productos por página',
        type: Number
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de productos obtenida exitosamente',
        type: [Product]
    })
    async getAllProducts(@Query() paginationQuery: PaginationQueryDto): Promise<Product[]> {
        return await this.productsService.getAllProducts();
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Obtener producto por ID',
        description: 'Retorna la información detallada de un producto específico'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del producto a buscar',
        type: String
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto encontrado exitosamente',
        type: Product
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Producto no encontrado' 
    })
    async getProductById(@Param('id') id: string): Promise<Product> {
        return await this.productsService.getProductById(id);
    }

    @Post('post')
    @ApiOperation({ 
        summary: 'Crear nuevo producto',
        description: 'Crea un nuevo producto en la tienda. Requiere autenticación.'
    })
    @ApiBody({ 
        type: ProductDto,
        description: 'Datos del nuevo producto'
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Producto creado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Datos inválidos del producto' 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado' 
    })
    @UseGuards(AuthGuard)
    @UseInterceptors(DateAdderInterceptor)
    async createProduct(@Body() product: ProductDto): Promise<{ message: string }> {
        try {
            const newProduct: Product = await this.productsService.createProduct(product);
            return { message: newProduct.id };
        } catch (error) {
            throw new BadRequestException('No se pudo crear el producto: ' + error.message)
        }
    }

    @Post('seeder')
    @ApiOperation({ 
        summary: 'Precargar productos',
        description: 'Carga datos iniciales de productos. Solo usar en base de datos vacía.'
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Productos precargados exitosamente' 
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Error - Base de datos no está vacía' 
    })
    async seederProducts() {
        if((await this.productsService.getAllProducts()).length) {
            throw new InternalServerErrorException('Solo usar cuando los productos estén vacíos'); 
        }
        await this.productsService.preloadProducts();
        return '¡Precarga realizada con éxito!';
    }

    @Put('put/:id')
    @ApiOperation({ 
        summary: 'Actualizar producto',
        description: 'Actualiza la información de un producto existente. Solo administradores.'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del producto a actualizar'
    })
    @ApiBody({ 
        type: ProductDto,
        description: 'Datos actualizados del producto'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto actualizado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            }
        }
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async updateProduct(@Param() params: ProductIdParam, @Body() product: ProductDto): Promise<{ message: string }>{
        try {
            const updatedProduct = await this.productsService.updateProduct(params.id, product);
            return { message: updatedProduct.id };
        } catch (error) {
            throw new BadRequestException('No se pudo actualizar el producto: ' + error.message)
        }
    }

    @Delete('delete/:id')
    @ApiOperation({ 
        summary: 'Eliminar producto',
        description: 'Elimina permanentemente un producto del sistema. Solo administradores.'
    })
    @ApiParam({
        name: 'id',
        description: 'UUID del producto a eliminar'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Producto eliminado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Producto eliminado correctamente'
                }
            }
        }
    })
    @UseInterceptors(DateAdderInterceptor)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteProduct(@Param() params: ProductIdParam): Promise<{message: string}> {
        try {
            await this.productsService.deleteProduct(params.id);
            return { message: 'Producto eliminado correctamente' }; 
        } catch (error) {
            throw new BadRequestException('No se pudo eliminar el producto: ' + error.message)
        }
    }
}