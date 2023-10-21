import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { DatabaseConfig } from './database.config';
import { OpenAIConfig } from './openai.config';

const CONFIGS = [ServerConfig, DatabaseConfig, OpenAIConfig];

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: CONFIGS,
  exports: CONFIGS,
})
export class ConfigModule {}