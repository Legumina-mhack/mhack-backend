import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.variables';
import { ServerConfig } from './config/server.config';

async function bootstrap() {
  const config = new ConfigService<EnvironmentVariables>();
  const serverConfig = new ServerConfig(config);
  const app = await NestFactory.create(AppModule);
  await app.listen(serverConfig.getPort());
}
bootstrap();
