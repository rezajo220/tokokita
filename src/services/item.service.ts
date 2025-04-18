import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from '../dto/item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.item.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async create(createItemDto: CreateItemDto) {
    try {
      return await this.prisma.item.create({
        data: createItemDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is the error code for unique constraint violation
        if (error.code === 'P2002') {
          // Check which field caused the unique constraint violation
          const target = error.meta?.target as string[];
          if (target && target.includes('sku')) {
            throw new ConflictException(`Item with SKU '${createItemDto.sku}' already exists`);
          }
        }
      }
      // Re-throw the error if it's not a unique constraint violation
      throw error;
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try {
      return await this.prisma.item.update({
        where: { id },
        data: updateItemDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025 is the error code for record not found
        if (error.code === 'P2025') {
          throw new NotFoundException(`Item with ID ${id} not found`);
        }
        // P2002 is the error code for unique constraint violation
        if (error.code === 'P2002' && updateItemDto.sku) {
          throw new ConflictException(`Item with SKU '${updateItemDto.sku}' already exists`);
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.item.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStockInfo(id: number) {
    const item = await this.findOne(id);
    
    // Get all batches for this item
    const batches = await this.prisma.stockBatch.findMany({
      where: { itemId: id },
      orderBy: { purchaseDate: 'asc' },
    });
    
    // Calculate total current stock
    const totalStock = batches.reduce(
      (sum, batch) => sum + batch.currentQuantity, 
      0
    );
    
    // Calculate average purchase price (weighted by current quantity)
    let weightedTotal = 0;
    for (const batch of batches) {
      weightedTotal += batch.currentQuantity * Number(batch.purchasePrice);
    }
    
    const averagePurchasePrice = totalStock > 0 
      ? parseFloat((weightedTotal / totalStock).toFixed(2)) 
      : 0;
    
    return {
      item,
      totalStock,
      averagePurchasePrice,
      batches,
    };
  }
}