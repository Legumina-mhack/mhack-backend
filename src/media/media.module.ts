import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MediaService } from './media.service';
import { S3Service } from './s3/s3.service';
import { ConfigModule } from '../config/config.module';
import { S3Config } from '../config/s3.config';
import { MediaController } from './media.controller';

@Module({
  providers: [S3Service, S3Config, ConfigService, MediaService],
  controllers: [MediaController],
  imports: [ConfigModule],
  exports: [MediaService],
})
export class MediaModule {}
