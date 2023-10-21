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
import * as cheerio from 'cheerio';
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
            serialNumber: report.productSN,
        });
        console.log("Generated file name: ", reportName)
        const attachments = {
            urls: report.mediaUrls,
            filenames: [reportName]
        }
        console.log(attachments)
        await this.mailer.sendMail(this.config.getReportReceiverEmail(), report.email, attachments);
        await fs.promises.rm(path.resolve(reportName)); // Delete the file after sending it
        console.log(path.resolve(reportName))
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

    async searchOnUokik(url: string, type: string) {
        const baseUrl = 'http://publikacje.uokik.gov.pl/hermes3_pub/'
        const html = await fetch(url).then(res => res.text())

        const $ = cheerio.load(html);
        const secondTds = $('table#rejestrTable tr td:nth-child(2) h2 a').map(async function() {
        const productUrl = baseUrl+$(this).attr('href')
        const html = await fetch(productUrl).then(res => res.text())
        const $1 = cheerio.load(html);

        const decisionDate = $1("#wpis > tbody > tr:nth-child(1) > td")
        const ean = $1("#wpis > tbody > tr:nth-child(10) > td")
        const decisionDescription = $1("#wpis > tbody > tr:nth-child(11) > td")
        const model = $1("#wpis > tbody > tr:nth-child(9) > td")
        
        return {
            name: $(this).text().trim(),
            href: productUrl,
            decisionDate: decisionDate.text(),
            ean: ean.text(),
            decisionDescription: decisionDescription.text(),
            model: model.text(),
            type: type
        }
        }).get();
        return await Promise.all(secondTds)
    }

    async searchForProductOnUokik(productName: string): Promise<any> {
        const baseUrl = 'http://publikacje.uokik.gov.pl/hermes3_pub/'
        const searchUrlDangerous = `${baseUrl}Rejestr.ashx?Typ=ProduktNiebezpieczny&DataWpisuOd=&DataWpisuDo=&NumerIdentyfikacyjny=&NazwaProduktu=${productName}&KodWyrobu=&Sort=&x=0&y=0`
        const searchUrlNonCompliant = `${baseUrl}Rejestr.ashx?Typ=WyrobNiezgodnyZZasadniczymiWymaganiami&DataWpisuOd=&DataWpisuDo=&NumerIdentyfikacyjny=&NazwaProduktu=${productName}&KodWyrobu=&Sort=&x=0&y=0`
        
        const result = await Promise.all([this.searchOnUokik(searchUrlDangerous, "dangerous"), this.searchOnUokik(searchUrlNonCompliant, "non-compliant")])
        return result.flat()
    }

    async checkProductsList(productName: string): Promise<any> {
        const reports = await this.repository.getReportsForProduct(productName);
        const productNames = reports.map(report => report.productName);
        const uniqueProductNames = [...new Set(productNames)];
        const uokikResult = await this.searchForProductOnUokik(productName);
        const deletedUniqueProductNames = (await this.summarizer.deleteSimilarDuplicates(uniqueProductNames))
            .map(productName => {return {name: productName, type: 'own'}})
        return [...uokikResult, ...deletedUniqueProductNames]
    }
}
