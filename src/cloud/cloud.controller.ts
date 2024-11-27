import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudService } from './cloud.service';
import { ProductsService } from '../store-management/products/product.service';
import { FileValidationPipe } from '../utils/pipes/file-validation.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';

@Controller('files')
export class CloudController {
  constructor(
    private readonly cloudService: CloudService,
    private readonly productsService: ProductsService,
  ) {}

  @Post('uploadImage/:id')
  async uploadImage(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Param('id') productId: string
  ) {
    const imageUrl = await this.cloudService.uploadImage(file);
    await this.productsService.updateProductImage(productId, imageUrl);
    return { imageUrl };
  }
}
