import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportQueryDto {
  @ApiProperty({
    description: 'Year (4-digit)',
    example: 2023,
    minimum: 2000,
    maximum: 2100
  })
  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year: number;

  @ApiProperty({
    description: 'Month (1-12)',
    example: 5,
    minimum: 1,
    maximum: 12
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
}

export class DailyProfitDto {
  @ApiProperty({
    description: 'Day of month',
    example: 15
  })
  day: number;

  @ApiProperty({
    description: 'Total sales amount for this day',
    example: 1250.75
  })
  sales: number;

  @ApiProperty({
    description: 'Total cost of goods sold for this day',
    example: 750.25
  })
  cogs: number;

  @ApiProperty({
    description: 'Gross profit for this day',
    example: 500.50
  })
  profit: number;

  @ApiProperty({
    description: 'Number of transactions for this day',
    example: 25
  })
  transactions: number;
}

export class ItemProfitDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1
  })
  itemId: number;

  @ApiProperty({
    description: 'Item name',
    example: 'Notebook A4'
  })
  itemName: string;

  @ApiProperty({
    description: 'Total quantity sold',
    example: 120
  })
  quantity: number;

  @ApiProperty({
    description: 'Total sales amount',
    example: 600.00
  })
  sales: number;

  @ApiProperty({
    description: 'Total cost of goods sold',
    example: 360.00
  })
  cogs: number;

  @ApiProperty({
    description: 'Gross profit',
    example: 240.00
  })
  profit: number;

  @ApiProperty({
    description: 'Profit margin percentage',
    example: 40.00
  })
  profitMargin: number;
}

export class MonthlyProfitReportDto {
  @ApiProperty({
    description: 'Year',
    example: 2023
  })
  year: number;

  @ApiProperty({
    description: 'Month (1-12)',
    example: 5
  })
  month: number;

  @ApiProperty({
    description: 'Total sales amount for the month',
    example: 28750.75
  })
  totalSales: number;

  @ApiProperty({
    description: 'Total cost of goods sold for the month',
    example: 17250.25
  })
  totalCogs: number;

  @ApiProperty({
    description: 'Gross profit for the month',
    example: 11500.50
  })
  grossProfit: number;

  @ApiProperty({
    description: 'Profit margin percentage',
    example: 40.00
  })
  profitMargin: number;

  @ApiProperty({
    description: 'Total number of items sold',
    example: 1560
  })
  itemCount: number;

  @ApiProperty({
    description: 'Daily breakdown of profits',
    type: [DailyProfitDto]
  })
  dailyProfits: DailyProfitDto[];

  @ApiProperty({
    description: 'Top selling items by profit',
    type: [ItemProfitDto]
  })
  topItems: ItemProfitDto[];

  @ApiProperty({
    description: 'Report generation timestamp',
    example: '2023-06-01T10:15:00Z'
  })
  generatedAt: Date;
}