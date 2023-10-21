import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './env.variables';

@Injectable()
export class S3Config {
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {}

  getBucketRegion(): string {
    return this.config.get<string>('AWS_REGION') || '';
  }

  getBucketName(): string {
    return this.config.get<string>('AWS_S3_BUCKET_NAME') || '';
  }

  getAwsAccessKeyId(): string {
    return this.config.get<string>('AWS_ACCESS_KEY_ID') || '';
  }

  getAwsSecretAccessKey(): string {
    return this.config.get<string>('AWS_SECRET_ACCESS_KEY') || '';
  }

  getBucketPrefix(): string {
    return this.config.get<string>('S3_BUCKET_PREFIX') || '__local';
  }

  getImgBaseUrl(): string {
    return this.config.get<string>('S3_IMG_BASE_URL') || 'https://media.eatzon.com';
  }
}
