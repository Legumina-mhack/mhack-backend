import { Module } from "@nestjs/common";
import { SummarizerService } from "./summarizer.service";
import { ConfigModule } from "@nestjs/config";
import { OpenAIConfig } from "src/config/openai.config";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [SummarizerService, OpenAIConfig],
    exports: [SummarizerService]
})
export class SummarizerModule {}