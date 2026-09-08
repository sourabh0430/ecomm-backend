import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.schema";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "./product.controller";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", authenticate, authorize(["super_admin"]), validate(createProductSchema), createProduct);
router.put("/:id", authenticate, authorize(["super_admin"]), validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, authorize(["super_admin"]), deleteProduct);

export default router;