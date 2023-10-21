import { IsString, IsNotEmpty, IsInt, validateSync, IsNumber } from 'class-validator';
import { Transform, plainToClass } from "class-transformer";

export class EnvironmentVariables {
  @IsInt()
  @Transform(({ value }) => +value)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY: string;

  @IsString()
  OPENAI_API_URL="https://api.openai.com/v1/chat/completions";

  @IsString()
  OPENAI_MODEL="gpt-3.5-turbo";

  OPENAI_TEMPERATURE=0.5;

  @IsString()
  @IsNotEmpty()
  MAILGUN_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_BUCKET_NAME: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  S3_BUCKET_PREFIX: string;

  @IsString()
  @IsNotEmpty()
  S3_IMG_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  REPORT_RECEIVER_EMAIL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}