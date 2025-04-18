import { Module } from '@nestjs/common';
import { ItemsController } from '../controllers/item.controller';
import { ItemsService } from '../services/item.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}