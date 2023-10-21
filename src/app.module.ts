import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.variables';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [ConfigModule, 
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const config = new ConfigService<EnvironmentVariables>();
        const dbConfig = new DatabaseConfig(config);
        return {
          url: dbConfig.getUrl(),
          verbose: dbConfig.getIsDbVerbose(),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
