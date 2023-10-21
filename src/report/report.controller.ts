import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportCreateDto } from './inputs/report.input';
import { MailerService } from 'src/mailer/mailer.service';
import { GenerateService } from 'src/generate-files/generate.service';
import { ReportFileType } from 'src/generate-files/file-type.enum';

@Controller('report')
export class ReportController {
    constructor(private readonly service: ReportService, private readonly mailer: MailerService, private readonly generator: GenerateService) {}

    @Get('test')
    @HttpCode(200)
    async testMail() {
        return this.mailer.sendMail('minister@carrotly.com', 'filip.kostecki00@gmail.com', ['']);
    }

    @Post('test')
    @HttpCode(200)
    async testGenerate() {
        const reportname = await this.generator.generateFile(ReportFileType.RETURN_OR_EXCHANGE, {
            productName: "Sennheiser PXC 550",
            name: "Filip Kostecki",
            sellerName: "Amazon",
            transactionDate: "2021-02-02",
            shortDescription: "Niedziałający przewód ładowania w Sennheiser PXC 550",
            description: "Przewód ładowania do słuchawek Sennheiser PXC 550 przestał działać. Nie jestem w stanie naładować słuchawek, co ogranicza ich praktyczność.",
            consumerAddress: "ul. Testowa 1, 00-000 Warszawa"
        });


    }


    //user create report
    @Post('create')
    @HttpCode(201)
    async createReport(@Body() report: ReportCreateDto) {
        return this.service.createReport(report);
    }

    //user check product reports
    @Get('list/product/:productName')
    @HttpCode(200)
    async findReportsByProduct(@Param() {productName}: any) {
        return this.service.getReportsForProduct(productName);
    }
    
    @Get('list/:id')
    @HttpCode(200)
    async findReportById(@Param() {id}: any) {
        return this.service.getReportById(id);
    }
    
    @Get('list/user/:userId')
    @HttpCode(200)
    async findReportsByUser(@Param() {userId}: any) { 
        return this.service.getReportsForUser(userId);
    }
}
