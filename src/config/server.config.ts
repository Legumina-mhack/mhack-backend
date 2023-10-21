import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "./env.variables";

@Injectable()
export class ServerConfig {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getPort(): number {
    return this.config.get<number>("PORT") || 3000;
  }

  getDatabaseUrl(): string {
    return this.config.get<string>("DATABASE_URL");
  }
}