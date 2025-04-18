import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ItemsService } from '../services/item.service';
import { CreateItemDto, UpdateItemDto, ItemResponseDto } from '../dto/item.dto';

@ApiTags('inventory')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all items', 
    type: [ItemResponseDto] 
  })
  async findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Item details', 
    type: ItemResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Item not found' 
  })
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The item has been successfully created', 
    type: ItemResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid data provided' 
  })
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The item has been successfully updated', 
    type: ItemResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Item not found' 
  })
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The item has been successfully deleted' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Item not found' 
  })
  async remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}