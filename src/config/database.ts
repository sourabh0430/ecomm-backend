import knex from 'knex';
import { env } from './env';

const db = knex({
    client: "pg",

    connection: {
        host: env.database.host,
        port: env.database.port,
        user: env.database.user,
        password: env.database.password,
        database: env.database.name,
    },

    pool: {
        min: 2,
        max: 10
    }
});

export default db;