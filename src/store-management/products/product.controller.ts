import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ProductsService } from "./product.service";
import { AuthGuard } from "src/auth/auth.guard";
import { ProductDto } from "src/database/products/product.dto";
import { UpdateProductDto } from "src/database/products/updateProduct.dto";
import { CategoriesService } from "../categories/category.service";
import { NewProductDto } from "src/database/products/newProduct.dto";
import { Roles } from 'src/config/role.decorator';
import { Role } from 'src/config/role.enum';
import { RolesGuard } from "../../auth/roles.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente.' })
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Post('post')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de producto inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createProduct(@Body() product: ProductDto) {
    if (await this.productsService.thisProductExist(product.name)) throw new InternalServerErrorException('Este producto ya fue registrado');
    
    const category = await this.categoriesService.findByName(product.category)

    if (!category) throw new InternalServerErrorException('La categoria no existe. Por favor, crea una primero'); 

    const newProduct: NewProductDto = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      category: category
    }

    return await this.productsService.createProduct(newProduct);
  }

  @Post('seeder')
  @ApiOperation({ summary: 'Precargar productos' })
  @ApiResponse({ status: 201, description: 'Productos precargados exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async seederProducts() {
    if((await this.productsService.getAllProducts()).length) throw new InternalServerErrorException('Solo usar cuando los productos esten vacios'); 
  
    await this.productsService.preloadProducts();

    return '¡Precarga realizada con exito!';
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de producto inválidos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async updateProduct(@Param('id') id: string, @Body() product: ProductDto) {
    return await this.productsService.updateProduct(id, product);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}