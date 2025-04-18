import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto, SaleResponseDto, SaleItemResponseDto } from '../dto/sale.dto';
import { InventoryService } from '../services/inventory.service';

@Injectable()
export class SaleService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async createSale(createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    if (!createSaleDto.items || createSaleDto.items.length === 0) {
      throw new BadRequestException('Sale must contain at least one item');
    }

    return this.prisma.executeWithTransaction(async (prisma) => {
      const processedItems: SaleItemResponseDto[] = [];
      let totalAmount = 0;
      let totalCogs = 0;

      for (const item of createSaleDto.items) {
        const result = await this.inventoryService.processStockForSale(
          item,
          prisma,
        );

        totalAmount += result.totalRevenue;
        totalCogs += result.totalCost;

        processedItems.push({
          id: 0, 
          itemId: item.itemId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          totalRevenue: result.totalRevenue,
          totalCost: result.totalCost,
          profit: parseFloat((result.totalRevenue - result.totalCost).toFixed(2)),
          details: result.stockDetails,
        });
      }

      const sale = await prisma.sale.create({
        data: {
          totalAmount,
          customerId: createSaleDto.customerId,
          reference: createSaleDto.reference,
          notes: createSaleDto.notes,
        },
      });

      for (let i = 0; i < processedItems.length; i++) {
        const item = createSaleDto.items[i];
        const processed = processedItems[i];
        
        const saleItem = await prisma.saleItem.create({
          data: {
            saleId: sale.id,
            itemId: item.itemId,
            quantity: item.quantity,
            sellingPrice: item.sellingPrice,
          },
        });
        
        processed.id = saleItem.id;
        
        for (const detail of processed.details) {
          await prisma.salesDetail.create({
            data: {
              saleItemId: saleItem.id,
              stockBatchId: detail.stockBatchId,
              quantity: detail.quantity,
              costPrice: detail.costPrice,
            },
          });
        }
      }

      const totalProfit = parseFloat((totalAmount - totalCogs).toFixed(2));

      return {
        id: sale.id,
        saleDate: sale.saleDate,
        totalAmount,
        customerId: sale.customerId,
        reference: sale.reference ?? undefined,
        items: processedItems,
        totalCogs,
        totalProfit,
      };
    });
  }
}