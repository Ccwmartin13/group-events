import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { entities } from '../entities';

config({ path: join(__dirname, '../../.env') });

export function buildTypeOrmOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    database: process.env.DATABASE_NAME ?? 'group_events',
    entities,
    migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
    synchronize: false,
  };
}

export default new DataSource(buildTypeOrmOptions());
