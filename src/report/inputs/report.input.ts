import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class ReportCreateDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
    
    @IsUrl()
    mediaUrls: string;
    
    @IsNotEmpty()
    sellerName: string;
    
    @IsNotEmpty()
    productName: string;
    
    @IsOptional()
    productSN?: string;
    
    @IsNotEmpty()
    productCompany: string;
    
    @IsNotEmpty()
    transactionDate: Date;
}
