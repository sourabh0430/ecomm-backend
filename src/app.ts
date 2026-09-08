import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.config";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/category.routes";
import attributeRoutes from "./modules/attributes/attribute.routes";
import productRoutes from "./modules/products/product.routes";
import variantRoutes from "./modules/variants/variant.routes";

const app = express();

app.use(express.json());

// Swagger UI Router
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/attributes", attributeRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/variants", variantRoutes);


export default app;