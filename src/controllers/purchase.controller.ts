import { Controller, Post, Body, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreatePurchaseDto, PurchaseResponseDto } from '../dto/purchase.dto';
import { InventoryService } from '../services/inventory.service';

@ApiTags('inventory')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Record a new stock purchase' })
  @ApiBody({ type: CreatePurchaseDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The stock purchase has been successfully recorded.', 
    type: PurchaseResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation error. The request body contains invalid data.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'The item specified in the request does not exist.' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    const purchase = await this.inventoryService.createPurchase(createPurchaseDto);
    return {
      ...purchase,
      purchasePrice: Number(purchase.purchasePrice),
      batchNumber: purchase.batchNumber ?? undefined,
    };
  }
}