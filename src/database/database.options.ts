import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Type,
} from '@nestjs/common';

export const DATABASE_OPTIONS_TOKEN = 'DATABASE_OPTIONS';

export interface DatabaseOptions {
  url: string;
  verbose?: boolean;
}

export interface DatabaseAsyncOptions {
  imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  useFactory?: (
      ...args: any[]
  ) =>
      | Promise<Omit<DatabaseOptions, 'isGlobal'>>
      | Omit<DatabaseOptions, 'isGlobal'>;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  providers?: Provider[];
}
