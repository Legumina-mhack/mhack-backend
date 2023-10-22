import { BadRequestException, Injectable } from "@nestjs/common";
import { ReportFileType } from "./file-type.enum";
import { ReportFileData } from "src/common/interfaces/report-file.interface";
import { Paragraph, TextRun, Packer, Document, AlignmentType, HeadingLevel } from "docx";
import * as fs from "fs";

@Injectable()
export class GenerateService {
    constructor() {}

    async generateFile(fileType: ReportFileType, args: ReportFileData): Promise<string> {
        if(fileType === ReportFileType.RETURN_OR_EXCHANGE) {
            return await this.generateReturnOrExchangeReport(args);
        }
        else if(fileType === ReportFileType.LOWER_PRICE_OR_WITHDRAW) {
            return await this.generateLowerPriceOrWithdrawReport(args);
        }
        throw new BadRequestException('Invalid file type');
    }

    async generateReturnOrExchangeReport(args: ReportFileData) {
        const conclusion = args.returnOrExchange === "return" ? "odstąpienia od umowy" : "wymiany towar na nowy";
        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: {
                            size: 24,
                            font: "Arial",
                        },
                    }
                }
            },
            sections: [{
                children: [
                    new Paragraph(`Sklep zakupu: ${args.sellerName}`),
                    new Paragraph(`Produkt: ${args.productName} ${args.serialNumber ? 'Numer seryjny: ' + args.serialNumber : ''}`),
                    new Paragraph(args.name),
                    new Paragraph(args.consumerAddress),
                    new Paragraph(`\n`),
                    new Paragraph({text: "Reklamacja towaru (żądanie obniżenia ceny lub odstąpienia od umowy w przypadku istotnego braku zgodności towaru z umową bez wcześniejszego skorzystania z naprawy/wymiany)", alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_3}),
                    new Paragraph(`\n`),
                    new Paragraph(`Zawiadamiam, że zakupiony przeze mnie w dniu ${new Date(args.transactionDate).toLocaleDateString()}. ${args.productName} jest niezgodny z umową. \nNiezgodność z umową polega na "${args.title}". W mojej ocenie brak zgodności z umową jest istotny, gdyż: ${args.description}.`),
                    new Paragraph(`\n`),
                    new Paragraph(`W związku z tym na podstawie ustawy z dnia 30 maja 2014 r. o prawach konsumenta (art. 43e) żądam:`),
                    new Paragraph({text: `${conclusion}.`, bullet: {level: 0}}),
                ],}]
        });

        const uniqueName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".docx";
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFileSync(uniqueName, buffer);

        return uniqueName
    }

    async generateLowerPriceOrWithdrawReport(args: ReportFileData) {
        let conclusion = "";
        if (args.accountNumber) {
            if (args.amount) {
                conclusion = `obniżenia ceny towaru o kwotę ${args.amount} zł. Proszę o zwrot podanej kwoty na konto ${args.accountNumber}`;
            } else {
                conclusion = `odstępuję od umowy i proszę o zwrot ceny towaru na konto ${args.accountNumber}`;
            }
        }
        if(conclusion === "") {
            throw new BadRequestException("Invalid data");
        }

        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: {
                            size: 24,
                            font: "Arial",
                        },
                    }
                }
            },
            sections: [{
                children: [
                    new Paragraph(`Sklep zakupu: ${args.sellerName}`),
                    new Paragraph(`Produkt: ${args.productName} ${args.serialNumber ? 'Numer seryjny: ' + args.serialNumber : ''}`),
                    new Paragraph(args.name),
                    new Paragraph(args.consumerAddress),
                    new Paragraph(`\n`),
                    new Paragraph({text: "Reklamacja towaru (żądanie obniżenia ceny lub odstąpienia od umowy w przypadku istotnego braku zgodności towaru z umową bez wcześniejszego skorzystania z naprawy/wymiany)", alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_3}),
                    new Paragraph(`Zawiadamiam, że zakupiony przeze mnie w dniu ${new Date(args.transactionDate).toLocaleDateString()}. ${args.productName} jest niezgodny z umową. \nNiezgodność z umową polega na ${args.title}. W mojej ocenie brak zgodności z umową jest istotny, gdyż ${args.description}. W związku z tym na podstawie ustawy z dnia 30 maja 2014 r. o prawach konsumenta (art. 43e) żądam:`),
                    new Paragraph({text: `${conclusion}.`, bullet: {level: 0}}),
                ],}]
        });

        const uniqueName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".docx";
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFileSync(uniqueName, buffer);

        return uniqueName
    }
}
