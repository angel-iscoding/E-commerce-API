import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';
import { ProductsModule } from '../products/product.module';

@Module({
  imports: [ProductsModule],
  providers: [CloudService],
  controllers: [CloudController],
  exports: [CloudService],
})
export class CloudModule {}
