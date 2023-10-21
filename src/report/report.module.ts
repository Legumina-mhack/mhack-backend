import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportSchema, Report } from './schema/report.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportRepository } from './report.repository';
import { SummarizerModule } from 'src/summarizer/summarizer.module';

@Module({
  imports: [    
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    SummarizerModule
  ],
  providers: [ReportService, ReportRepository],
  controllers: [ReportController]
})
export class ReportModule {}
