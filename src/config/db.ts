import postgres from 'postgres';
import { env } from './env';

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = env;

const sql = postgres({
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

export default sql;
