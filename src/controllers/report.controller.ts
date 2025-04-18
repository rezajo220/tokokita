import { Controller, Get, Query, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportQueryDto, MonthlyProfitReportDto } from '../dto/report.dto';
import { ReportService } from '../services/report.service';

@ApiTags('reports')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get monthly profit report based on FIFO inventory method' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Monthly profit report successfully generated.', 
    type: MonthlyProfitReportDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid year or month parameters.' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMonthlyReport(@Query() query: ReportQueryDto): Promise<MonthlyProfitReportDto> {
    return this.reportService.getMonthlyProfitReport(query.year, query.month);
  }
}