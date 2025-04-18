import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @ApiProperty({
    description: 'ID of the item being sold',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  itemId: number;

  @ApiProperty({
    description: 'Quantity of items sold',
    example: 5,
    minimum: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Selling price per unit',
    example: 25.99
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  sellingPrice: number;
}

export class CreateSaleDto {
  @ApiProperty({
    description: 'List of items in this sale',
    type: [SaleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @ApiProperty({
    description: 'Optional customer ID',
    example: 42,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  customerId?: number;

  @ApiProperty({
    description: 'Optional reference number for the sale',
    example: 'INV-2023-0001',
    required: false
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({
    description: 'Optional notes for the sale',
    example: 'Customer requested gift wrapping',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SaleDetailDto {
  @ApiProperty({
    description: 'Stock batch ID',
    example: 1
  })
  stockBatchId: number;

  @ApiProperty({
    description: 'Quantity taken from this batch',
    example: 5
  })
  quantity: number;

  @ApiProperty({
    description: 'Cost price of this batch (for COGS calculation)',
    example: 15.50
  })
  costPrice: number;
}

export class SaleItemResponseDto {
  @ApiProperty({
    description: 'Sale item ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Item ID',
    example: 1
  })
  itemId: number;

  @ApiProperty({
    description: 'Quantity sold',
    example: 5
  })
  quantity: number;

  @ApiProperty({
    description: 'Selling price per unit',
    example: 25.99
  })
  sellingPrice: number;

  @ApiProperty({
    description: 'Total revenue for this item',
    example: 129.95
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Total cost for this item (COGS)',
    example: 77.50
  })
  totalCost: number;

  @ApiProperty({
    description: 'Profit for this item',
    example: 52.45
  })
  profit: number;

  @ApiProperty({
    description: 'Detailed FIFO breakdown',
    type: [SaleDetailDto]
  })
  details: SaleDetailDto[];
}

export class SaleResponseDto {
  @ApiProperty({
    description: 'Sale ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Sale date',
    example: '2023-05-15T14:30:00Z'
  })
  saleDate: Date;

  @ApiProperty({
    description: 'Total amount',
    example: 129.95
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Customer ID',
    example: 42,
    required: false
  })
  customerId: number | null;

  @ApiProperty({
    description: 'Reference number',
    example: 'INV-2023-0001',
    required: false
  })
  reference?: string;

  @ApiProperty({
    description: 'Items sold in this transaction',
    type: [SaleItemResponseDto]
  })
  items: SaleItemResponseDto[];

  @ApiProperty({
    description: 'Total cost of goods sold',
    example: 77.50
  })
  totalCogs: number;

  @ApiProperty({
    description: 'Total profit',
    example: 52.45
  })
  totalProfit: number;
}