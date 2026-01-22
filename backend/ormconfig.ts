import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
import * as oracledb from 'oracledb';
oracledb.initOracleClient({ configDir: '', libDir: '' });

const cleanValue = (value?: string) => (value || '').replace(/'/g, '').trim();
const username = cleanValue(process.env.DB_USERNAME);
const schema = cleanValue(process.env.DB_SCHEMA) || username;

export const AppDataSource = new DataSource({
    type: 'oracle',
    connectString: cleanValue(process.env.CONNECT_STRING),
    port: parseInt(cleanValue(process.env.DB_PORT) || '1521', 10),
    username,
    password: cleanValue(process.env.DB_PASSWORD),
    schema,
    migrationsTableName: 'migrations',
    entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    synchronize: false,
});
