import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createVariantSchema, updateVariantSchema } from "./variant.schema";
import {
    getProductVariants,
    getVariant,
    createVariant,
    updateVariant,
    deleteVariant
} from "./variant.controller";

const router = Router();

// Routes nested under product context
router.get("/products/:productId/variants", getProductVariants);
router.post("/products/:productId/variants", authenticate, authorize(["super_admin"]), validate(createVariantSchema), createVariant);

// Independent Variant Management Routes
router.get("/variants/:id", getVariant);
router.put("/variants/:id", authenticate, authorize(["super_admin"]), validate(updateVariantSchema), updateVariant);
router.delete("/variants/:id", authenticate, authorize(["super_admin"]), deleteVariant);

export default router;