import type { Knex } from "knex";
import path from "path";
import { env } from "./env";

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'pg',
        connection: {
            host: env.database.host,
            port: env.database.port,
            user: env.database.user,
            password: env.database.password,
            database: env.database.name,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: path.resolve(__dirname, '../database/migrations'),
            extension: "ts",
            tableName: "knex_migrations"
        },
        seeds: {
            directory: path.resolve(__dirname, '../database/seeds'),
            extension: "ts",
        },
    }
}

export const knexConfig = config[env.nodeEnv];
export default config;