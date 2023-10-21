import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DATABASE_OPTIONS_TOKEN, DatabaseOptions } from './database.options';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(DATABASE_OPTIONS_TOKEN)
        private readonly options: DatabaseOptions,
    ) {
        super({
            datasourceUrl: options.url,
            log: options.verbose ? ['info', 'query', 'warn', 'error'] : undefined,
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
