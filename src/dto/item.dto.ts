import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Notebook A4'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the item',
    example: 'NB-A4-001'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Standard A4 notebook with 100 pages, ruled',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Notebook A4 Premium',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the item',
    example: 'NB-A4-002',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku?: string; // This should be string type, not boolean

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Premium A4 notebook with 120 pages, ruled with margins',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class ItemResponseDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Name of the item',
    example: 'Notebook A4'
  })
  name: string;

  @ApiProperty({
    description: 'Stock Keeping Unit - unique identifier for the item',
    example: 'NB-A4-001'
  })
  sku: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Standard A4 notebook with 100 pages, ruled',
    required: false
  })
  description: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-05-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-05-15T10:30:00Z'
  })
  updatedAt: Date;
}

export class ItemStockInfoDto extends ItemResponseDto {
  @ApiProperty({
    description: 'Total available stock quantity',
    example: 150
  })
  totalStock: number;

  @ApiProperty({
    description: 'Average purchase price (weighted)',
    example: 11.33
  })
  averagePurchasePrice: number;

  @ApiProperty({
    description: 'Stock batches details',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        purchaseDate: { type: 'string', format: 'date-time', example: '2023-05-10T14:30:00Z' },
        currentQuantity: { type: 'number', example: 50 },
        purchasePrice: { type: 'number', example: 10.50 },
        batchNumber: { type: 'string', example: 'BATCH-2023-05-001' }
      }
    }
  })
  batches: any[];
}