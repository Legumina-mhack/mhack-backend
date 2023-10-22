import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportCreateDto } from './inputs/report.input';

@Controller('report')
export class ReportController {
    constructor(private readonly service: ReportService) {}

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

    @Get('list/products/:productName')
    @HttpCode(200)
    async findReportsByProducts(@Param() {productName}: any) {
        return this.service.checkProductsList(productName);
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
