import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce Backend API',
            version: '1.0.0',
            description: 'REST API documentation for the E-Commerce backend service',
        },
        servers: [
            {
                url: `http://localhost:${env.port}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token in the format "Bearer <token>"',
                },
            },
        },
    },
    apis: [
        './src/swagger/**/*.ts',
        './src/swagger/**/*.js',
        './src/app.ts',
        './src/app.js',
    ],
    failOnErrors: false,
};

export const swaggerSpec = swaggerJsdoc(options);
