import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { DeleteObjectsRequest } from 'aws-sdk/clients/s3';

import { S3Config } from 'src/config/s3.config';
import { ServerConfig } from 'src/config/server.config';

const ONE_HOUR = 3600;

@Injectable()
export class S3Service {
  private S3: S3;
  constructor(readonly s3Config: S3Config, readonly serverConfig: ServerConfig) {
    this.S3 = new S3({
      signatureVersion: 'v4',
      region: this.s3Config.getBucketRegion(),
      credentials:
        this.s3Config.getAwsAccessKeyId() && this.s3Config.getAwsSecretAccessKey()
          ? {
              accessKeyId: this.s3Config.getAwsAccessKeyId(),
              secretAccessKey: this.s3Config.getAwsSecretAccessKey(),
            }
          : undefined,
    });
  }

  async getUrlForUpload(fileKey: string): Promise<string> {
    return this.S3.getSignedUrl('putObject', {
      Bucket: this.s3Config.getBucketName(),
      Key: `${this.s3Config.getBucketPrefix()}/${fileKey}`,
      ContentType: 'image/*',
      // ServerSideEncryption: 'AES256',
      Expires: ONE_HOUR,
      // ACL: 'private',
    });
  }

  public getUrlForDownload(fileKey: string): string {
    return this.S3.getSignedUrl('putObject', {
        Bucket: this.s3Config.getBucketName(),
        Key: `${this.s3Config.getBucketPrefix()}/${fileKey}`,
        ContentType: 'image/*',
        // ServerSideEncryption: 'AES256',
        Expires: ONE_HOUR,
        // ACL: 'private',
      });
     //return `${this.s3Config.getImgBaseUrl()}/${this.s3Config.getBucketPrefix()}/${fileKey}`;
  }

  async deleteKeys(fileKeys: string[]) {
    const objects = fileKeys.map((key) => ({
      Key: key,
    }));
    const params: DeleteObjectsRequest = {
      Bucket: this.s3Config.getBucketName(),
      Delete: { Objects: objects },
    };
    return this.S3.deleteObjects(params).promise();
  }

  async uploadCsvFile(fileKey: string, bucket: string, body: string) {
    const params = {
      Bucket: bucket,
      Key: fileKey,
      Body: body,
    };
    return this.S3.upload(params).promise();
  }
}
