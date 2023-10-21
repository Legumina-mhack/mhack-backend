import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { ReportDocument } from './schema/report.schema';
import { SummarizerService } from 'src/summarizer/summarizer.service';
import { GenerateService } from 'src/generate-files/generate.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ReportFileType } from 'src/generate-files/file-type.enum';
import { ServerConfig } from 'src/config/server.config';
import * as fs from "fs";
import * as path from 'path';
@Injectable()
export class ReportService {
    constructor(
        private readonly repository: ReportRepository, 
        private readonly summarizer: SummarizerService,
        private readonly mailer: MailerService,
        private readonly generator: GenerateService,
        private readonly config: ServerConfig
        ) {}

    async createReport(report: Partial<ReportDocument>): Promise<any> {
        const reportFromDb = await this.repository.create(report);
        const reportType = report.desiredAmountToReturn ? ReportFileType.LOWER_PRICE_OR_WITHDRAW : ReportFileType.RETURN_OR_EXCHANGE; 
        const reportName = await this.generator.generateFile(reportType, {
            name: "Temp name",
            sellerName: report.sellerName,
            transactionDate: report.transactionDate,
            title: report.title,
            description: report.description,
            consumerAddress: report.consumerAddress,
            productName: report.productName,
            returnOrExchange: report.returnOrExchange,
            accountNumber: report.accountNumber,
            amount: report.desiredAmountToReturn,
        });
        console.log("Generated file name: ", reportName)
        const attachments = {
            urls: report.mediaUrls,
            filenames: [reportName]
        }
        console.log(attachments)
        await this.mailer.sendMail(this.config.getReportReceiverEmail(), report.email, attachments);
        await fs.promises.unlink(path.resolve(reportName)); // Delete the file after sending it
        return reportFromDb;
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
