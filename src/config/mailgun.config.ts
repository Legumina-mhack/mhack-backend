import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env.variables";

@Injectable()
export class MailgunConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getApiKey(): string {
    return this.config.get<string>("MAILGUN_API_KEY");
  }
}