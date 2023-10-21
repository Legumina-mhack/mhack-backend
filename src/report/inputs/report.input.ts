import { IsEmail, IsIBAN, IsNotEmpty, IsOptional, IsUrl, MinLength } from "class-validator";

export class ReportCreateDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
    
    @IsUrl({},{each: true})
    mediaUrls: string[];
    
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

    @IsNotEmpty()
    consumerAddress: string

    @IsOptional()
    returnOrExchange?: "return" | "exchange";

    @IsOptional()
    @IsIBAN()
    accountNumber?: string;

    @IsOptional()
    desiredAmountToReturn?: number;


    @IsNotEmpty()
    @IsEmail()
    email: string;
}
