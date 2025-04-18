import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from '../dto/purchase.dto';
import { SaleItemDto } from '../dto/sale.dto';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createPurchase(purchaseData: CreatePurchaseDto) {
    const item = await this.prisma.item.findUnique({
      where: { id: purchaseData.itemId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with ID ${purchaseData.itemId} not found`,
      );
    }

    return this.prisma.stockBatch.create({
      data: {
        itemId: purchaseData.itemId,
        quantity: purchaseData.quantity,
        currentQuantity: purchaseData.quantity,
        purchasePrice: purchaseData.purchasePrice,
        batchNumber: purchaseData.batchNumber,
        expiryDate: purchaseData.expiryDate,
      },
    });
  }

  async processStockForSale(
    saleItem: SaleItemDto,
    prismaTransaction: PrismaClient,
  ) {
    const item = await prismaTransaction.item.findUnique({
      where: { id: saleItem.itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${saleItem.itemId} not found`);
    }

    const availableBatches = await prismaTransaction.stockBatch.findMany({
      where: {
        itemId: saleItem.itemId,
        currentQuantity: { gt: 0 },
      },
      orderBy: { purchaseDate: 'asc' },
    });

    const totalAvailableStock = availableBatches.reduce(
      (sum, batch) => sum + batch.currentQuantity,
      0,
    );

    if (totalAvailableStock < saleItem.quantity) {
      throw new BadRequestException(
        `Insufficient stock for item ${saleItem.itemId}. Requested: ${saleItem.quantity}, Available: ${totalAvailableStock}`,
      );
    }

    let remainingQuantity = saleItem.quantity;
    const stockDetails: {
      stockBatchId: number;
      quantity: number;
      costPrice: number;
    }[] = [];
    let totalCost = 0;

    for (const batch of availableBatches) {
      if (remainingQuantity <= 0) break;

      const quantityFromBatch = Math.min(
        remainingQuantity,
        batch.currentQuantity,
      );

      const costFromBatch = parseFloat(
        (quantityFromBatch * Number(batch.purchasePrice)).toFixed(2),
      );
      stockDetails.push({
        stockBatchId: batch.id,
        quantity: quantityFromBatch,
        costPrice: Number(batch.purchasePrice),
      });
      await prismaTransaction.stockBatch.update({
        where: { id: batch.id },
        data: { currentQuantity: batch.currentQuantity - quantityFromBatch },
      });

      remainingQuantity -= quantityFromBatch;
      totalCost += costFromBatch;
    }

    return {
      stockDetails,
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalRevenue: parseFloat(
        (saleItem.quantity * saleItem.sellingPrice).toFixed(2),
      ),
    };
  }

  async calculateMonthlyProfit(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    const sales = await this.prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        saleItems: {
          include: {
            salesDetails: true,
            item: true,
          },
        },
      },
    });

    const dailyProfits = new Map();
    let totalSales = 0;
    let totalCogs = 0;
    let totalItems = 0;
    const itemProfits = new Map();

    for (const sale of sales) {
      const saleDay = sale.saleDate.getDate();

      if (!dailyProfits.has(saleDay)) {
        dailyProfits.set(saleDay, {
          sales: 0,
          cogs: 0,
          profit: 0,
          transactions: 0,
        });
      }

      const dailyProfit = dailyProfits.get(saleDay);
      dailyProfit.transactions += 1;

      let saleCogs = 0;

      for (const saleItem of sale.saleItems) {
        const revenue = parseFloat(
          (saleItem.quantity * Number(saleItem.sellingPrice)).toFixed(2),
        );

        const cogs = saleItem.salesDetails.reduce(
          (sum, detail) => sum + detail.quantity * Number(detail.costPrice),
          0,
        );

        dailyProfit.sales += revenue;
        dailyProfit.cogs += cogs;
        saleCogs += cogs;
        totalItems += saleItem.quantity;

        const itemKey = saleItem.itemId;
        if (!itemProfits.has(itemKey)) {
          itemProfits.set(itemKey, {
            itemId: saleItem.itemId,
            itemName: saleItem.item.name,
            quantity: 0,
            sales: 0,
            cogs: 0,
            profit: 0,
            profitMargin: 0,
          });
        }

        const itemProfit = itemProfits.get(itemKey);
        itemProfit.quantity += saleItem.quantity;
        itemProfit.sales += revenue;
        itemProfit.cogs += cogs;
        itemProfit.profit = parseFloat(
          (itemProfit.sales - itemProfit.cogs).toFixed(2),
        );
        itemProfit.profitMargin = parseFloat(
          ((itemProfit.profit / itemProfit.sales) * 100).toFixed(2),
        );
      }

      dailyProfit.profit = parseFloat(
        (dailyProfit.sales - dailyProfit.cogs).toFixed(2),
      );

      totalSales += Number(sale.totalAmount);
      totalCogs += saleCogs;
    }

    const dailyProfitsArray = Array.from(dailyProfits.entries()).map(
      ([day, data]) => ({
        day,
        ...data,
        sales: parseFloat(data.sales.toFixed(2)),
        cogs: parseFloat(data.cogs.toFixed(2)),
      }),
    );

    const topItems = Array.from(itemProfits.values())
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);

    const grossProfit = parseFloat((totalSales - totalCogs).toFixed(2));
    const profitMargin = parseFloat(
      ((grossProfit / totalSales) * 100).toFixed(2),
    );

    return {
      year,
      month,
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalCogs: parseFloat(totalCogs.toFixed(2)),
      grossProfit,
      profitMargin: isNaN(profitMargin) ? 0 : profitMargin,
      itemCount: totalItems,
      dailyProfits: dailyProfitsArray,
      topItems,
      generatedAt: new Date(),
    };
  }
}
