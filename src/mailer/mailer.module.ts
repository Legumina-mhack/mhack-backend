import { Module } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { ConfigModule } from "@nestjs/config";
import { MailgunConfig } from "src/config/mailgun.config";

@Module({
    imports: [ConfigModule],
    providers: [MailerService, MailgunConfig],
    exports: [MailerService],
})
export class MailerModule {}  