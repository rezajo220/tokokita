import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './modules/item.module';
import { PurchasesModule } from './modules/purchase.module';
import { SalesModule } from './modules/sale.module';
import { ReportsModule } from './modules/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ItemsModule,
    PurchasesModule,
    SalesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}