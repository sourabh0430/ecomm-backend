import type { Knex } from "knex";
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
            directory: './src/database/migrations',
        },
        seeds: {
            directory: './src/database/seeds',
        },
    }
}

export const knexConfig = config[env.nodeEnv];