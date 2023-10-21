import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReportState } from 'src/common/enums/report.state.enum';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
    _id: Types.ObjectId;
    
    
    @Prop({ type: String, trim: true, required: true })
    title: string;

    @Prop({type: String, trim: true, required: true})
    description: string;

    @Prop({type: String, required: true})
    userId: string
    
    @Prop({type: String, enum: ReportState, default: ReportState.PENDING})
    state: ReportState;

    @Prop({type: String, required: true})
    mediaUrls: string;



    @Prop({type: String, required: true})
    sellerName: string;

    @Prop({type: String})
    productName: string;

    @Prop({type: String})
    productSN: string;

    @Prop({type: String})
    productCompany: string;

    @Prop({type: Date})
    transactionDate: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({productName: 1})
