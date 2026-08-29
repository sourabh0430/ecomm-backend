import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.config";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

// Swagger UI Router
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API Routes
app.use("/api/v1/auth", authRoutes)


export default app;