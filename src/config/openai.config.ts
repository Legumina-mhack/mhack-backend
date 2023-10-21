import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env.variables";
import { ServerConfig } from "./server.config";

@Injectable()
export class OpenAIConfig {
    serverConfig: any;
    constructor(private readonly config: ConfigService<EnvironmentVariables>) {
        this.serverConfig = new ServerConfig(config);
    }

    getApiKey(): string {
        return this.config.get('OPENAI_API_KEY');
    }

    getApiUrl(): string {
        return this.config.get('OPENAI_API_URL');
    }

    getModel(): string {
        return this.config.get('OPENAI_MODEL');
    }

    getTemperature(): number {
        return this.config.get('OPENAI_TEMPERATURE');
    }


}