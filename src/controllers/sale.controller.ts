import { Controller, Post, Body, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateSaleDto, SaleResponseDto } from '../dto/sale.dto';
import { SaleService } from '../services/sale.service';

@ApiTags('sales')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ summary: 'Record a new sale transaction with FIFO inventory management' })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The sale has been successfully recorded with FIFO inventory calculations.', 
    type: SaleResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation error or insufficient stock error.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'One or more items specified in the request do not exist.' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSale(@Body() createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.saleService.createSale(createSaleDto);
  }
}