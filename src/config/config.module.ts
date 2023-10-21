import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from './env.variables';
import { ServerConfig } from './server.config';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [ServerConfig, DatabaseConfig],
  exports: [ServerConfig, DatabaseConfig],
})
export class ConfigModule {}