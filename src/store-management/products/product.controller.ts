import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/database/products/product.dto";
import { Roles } from 'src/config/role.decorator';
import { Role } from 'src/config/role.enum';
import { RolesGuard } from "../../auth/roles.guard";
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; //Uso luego
import { Product } from "./product.entity";
import { IsUUID } from "class-validator";

class ProductIdParam {
  @IsUUID()
  id: string;
}


@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return await this.productsService.getAllProducts();
  }

  @Post('post')
  //@UseGuards(AuthGuard)
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
  //@UseGuards(AuthGuard, RolesGuard)
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
  //@UseGuards(AuthGuard, RolesGuard)
  async deleteProduct(@Param() params: ProductIdParam): Promise<{message: string}> {
    try {
      await this.productsService.deleteProduct(params.id);
      return { message: 'Producto eliminado correctamente' }; 
    } catch (error) {
      throw new BadRequestException('No se pudo eliminar el producto: ' + error.message)
    }
  }
}