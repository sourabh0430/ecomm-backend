import "dotenv/config";

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        name: process.env.DB_NAME ?? 'ecommerce',
        user: process.env.DB_USER ?? 'sourabhjain',
        password: process.env.DB_PASSWORD ?? 'root',
    },
}