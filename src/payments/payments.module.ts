import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaypalService } from './paypal.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaypalService],
  exports: [PaypalService],
})
export class PaymentsModule {}