import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { DatabaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: DatabaseConfig,
    }),
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}