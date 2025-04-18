import { Module } from '@nestjs/common';
import { PurchaseController } from '../controllers/purchase.controller';
import { InventoryModule } from './inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [PurchaseController],
})
export class PurchasesModule {}