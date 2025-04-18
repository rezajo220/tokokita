import { Module } from '@nestjs/common';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service';
import { InventoryModule } from './inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportsModule {}