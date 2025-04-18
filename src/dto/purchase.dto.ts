import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class CreatePurchaseDto {
  @ApiProperty({
    description: 'ID of the item being purchased',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  itemId: number;

  @ApiProperty({
    description: 'Quantity of items purchased',
    example: 100,
    minimum: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Purchase price per unit',
    example: 15.50
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  purchasePrice: number;

  @ApiProperty({
    description: 'Optional batch or lot number',
    example: 'BATCH-2023-05-001',
    required: false
  })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiProperty({
    description: 'Optional expiry date for perishable items',
    example: '2024-12-31',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;
}

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'Purchase ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Item ID',
    example: 1
  })
  itemId: number;

  @ApiProperty({
    description: 'Purchase date',
    example: '2023-05-15T10:30:00Z'
  })
  purchaseDate: Date;

  @ApiProperty({
    description: 'Quantity purchased',
    example: 100
  })
  quantity: number;

  @ApiProperty({
    description: 'Current remaining quantity',
    example: 100
  })
  currentQuantity: number;

  @ApiProperty({
    description: 'Purchase price per unit',
    example: 15.50
  })
  purchasePrice: number;

  @ApiProperty({
    description: 'Batch number',
    example: 'BATCH-2023-05-001',
    required: false
  })
  batchNumber?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-05-15T10:30:00Z'
  })
  createdAt: Date;
}