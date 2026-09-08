import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "./category.controller";

const router = Router();

//Publicly read categories
router.get("/", getCategories);
router.get("/:id", getCategory);

//Admin only management endpoints
router.post("/", authenticate, authorize(["super_admin"]), validate(createCategorySchema), createCategory);

router.put("/:id", authenticate, authorize(["super_admin"]), validate(updateCategorySchema), updateCategory);

router.delete("/:id", authenticate, authorize(["super_admin"]), deleteCategory);

export default router;
