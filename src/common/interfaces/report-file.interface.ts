export interface ReportFileData {
    name: string;
    sellerName: string;
    transactionDate: string | Date;
    title: string;
    description: string;
    consumerAddress: string;
    productName: string;

    returnOrExchange?: "return" | "exchange";

    accountNumber?: string;
    amount?: number;
}