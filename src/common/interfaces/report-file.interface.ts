export interface ReportFileData {
    name: string;
    sellerName: string;
    transactionDate: string;
    shortDescription: string;
    description: string;
    consumerAddress: string;
    productName: string;

    returnOrExchange?: "return" | "exchange";

    accountNumber?: string;
    amount?: number;
}