import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { ReportDocument, Report } from "./schema/report.schema";


@Injectable()
export class ReportRepository {
    constructor(@InjectModel(Report.name) private reportModel: Model<ReportDocument>) {}

    async create(report: Partial<Report>): Promise<Report> {
        report.userId = '123'
        const createdReport = new this.reportModel(report);
        return createdReport.save();
    }

    async getReportById(id: string): Promise<Report> {
        const order = await this.reportModel.findById(id);
        if (!order) {
            throw new NotFoundException(`Report with id ${id} not found`);
        }
        return order;
    }

    async getReportsForUser(userId: string): Promise<Report[]> {
        const reports = await this.reportModel.find({userId});
        return reports;
    }

    async getReportsForProduct(productName: string): Promise<Report[]> {
        const aggregation: PipelineStage[] = [{
            $search: {
              index: "productName",
              text: {
                fuzzy: {},
                query: productName,
                path: {
                  wildcard: "*"
                }
              }
            }
          }
      ]
      const data = await this.reportModel.aggregate<ReportDocument>(aggregation);
      return data;
    }

}