import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards, UseInterceptors, Query } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/database/products/product.dto";
import { Roles } from 'src/config/role.decorator';
import { Role } from 'src/config/role.enum';
import { RolesGuard } from "../../auth/roles.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Product } from "./product.entity";
import { IsUUID } from "class-validator";
import { DateAdderInterceptor } from "src/utils/interceptors/date-adder.interceptor";
import { PaginationQueryDto } from "src/database/pagination-query.dto";

class ProductIdParam {
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
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getAllProducts(@Query() paginationQuery: PaginationQueryDto): Promise<Product[]> {
    return await this.productsService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Post('post')
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
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
  async seederProducts() {
    if((await this.productsService.getAllProducts()).length) throw new InternalServerErrorException('Solo usar cuando los productos esten vacios'); 
  
    await this.productsService.preloadProducts();

    return '¡Precarga realizada con exito!';
  }

  @Put('put/:id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
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