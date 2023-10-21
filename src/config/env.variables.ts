import { IsString, IsNotEmpty, IsInt, validateSync } from 'class-validator';
import { Transform, plainToClass } from "class-transformer";

export class EnvironmentVariables {
  @IsInt()
  @Transform(({ value }) => +value)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;
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