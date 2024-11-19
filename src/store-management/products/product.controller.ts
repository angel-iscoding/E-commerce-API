import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/database/products/product.dto";

import { Roles } from 'src/config/role.decorator';
import { Role } from 'src/config/role.enum';
import { RolesGuard } from "../../auth/roles.guard";
import { Product } from "./product.entity";
// import { CategoriesService } from "../categories/category.service";
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; //Uso luego

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
  @UseGuards(AuthGuard)
  async createProduct(@Body() product: ProductDto) {
    if (await this.productsService.thisProductExist(product.name)) throw new InternalServerErrorException('Este producto ya fue registrado');

    return await this.productsService.createProduct(product);
  }

  @Post('seeder')
  async seederProducts() {
    if((await this.productsService.getAllProducts()).length) throw new InternalServerErrorException('Solo usar cuando los productos esten vacios'); 
  
    await this.productsService.preloadProducts();

    return '¡Precarga realizada con exito!';
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProduct(@Param('id') id: string, @Body() product: ProductDto) {
    return await this.productsService.updateProduct(id, product);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}