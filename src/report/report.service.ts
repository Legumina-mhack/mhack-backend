import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { ReportDocument } from './schema/report.schema';
import { SummarizerService } from 'src/summarizer/summarizer.service';

@Injectable()
export class ReportService {
    constructor(private readonly repository: ReportRepository, private readonly summarizer: SummarizerService) {}

    async createReport(report: Partial<ReportDocument>): Promise<any> {
        return this.repository.create(report);
    }

    async getReportById(id: string): Promise<any> {
        return this.repository.getReportById(id);
    }

    async getReportsForUser(userId: string): Promise<any> {
        return this.repository.getReportsForUser(userId);
    }

    async getReportsForProduct(productName: string): Promise<any> {
        const reports = await this.repository.getReportsForProduct(productName);
        const reasons = reports.map(report => report.description);
        const summary = await this.summarizer.summarize(reasons);
        return summary
    }
}
