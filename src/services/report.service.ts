import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MonthlyProfitReportDto } from '../dto/report.dto';
import { InventoryService } from '../services/inventory.service';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async getMonthlyProfitReport(year: number, month: number): Promise<MonthlyProfitReportDto> {
    const cachedReport = await this.prisma.profitReport.findUnique({
      where: {
        year_month: {
          year,
          month,
        },
      },
    });

    if (
      cachedReport &&
      new Date().getTime() - cachedReport.generatedAt.getTime() < 24 * 60 * 60 * 1000
    ) {
      
      const detailedReport = await this.inventoryService.calculateMonthlyProfit(year, month);
      
      return {
        year,
        month,
        totalSales: Number(cachedReport.totalSales),
        totalCogs: Number(cachedReport.totalCogs),
        grossProfit: Number(cachedReport.grossProfit),
        profitMargin: parseFloat(
          ((Number(cachedReport.grossProfit) / Number(cachedReport.totalSales)) * 100).toFixed(2)
        ),
        itemCount: cachedReport.itemCount,
        dailyProfits: detailedReport.dailyProfits,
        topItems: detailedReport.topItems,
        generatedAt: cachedReport.generatedAt,
      };
    }

    const report = await this.inventoryService.calculateMonthlyProfit(year, month);

    await this.prisma.profitReport.upsert({
      where: {
        year_month: {
          year,
          month,
        },
      },
      update: {
        totalSales: report.totalSales,
        totalCogs: report.totalCogs,
        grossProfit: report.grossProfit,
        itemCount: report.itemCount,
        generatedAt: new Date(),
      },
      create: {
        year,
        month,
        totalSales: report.totalSales,
        totalCogs: report.totalCogs,
        grossProfit: report.grossProfit,
        itemCount: report.itemCount,
        generatedAt: new Date(),
      },
    });

    return report;
  }
}