import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createAttributeTypeSchema,
    updateAttributeTypeSchema,
    createAttributeValueSchema,
    updateAttributeValueSchema
} from "./attribute.schema";
import {
    getTypes,
    createType,
    updateType,
    deleteType,
    getValues,
    createValue,
    updateValue,
    deleteValue
} from "./attribute.controller";

const router = Router();

// Types routes
router.get("/", authenticate, authorize(["super_admin"]), getTypes);
router.post("/", authenticate, authorize(["super_admin"]), validate(createAttributeTypeSchema), createType);
router.put("/:id", authenticate, authorize(["super_admin"]), validate(updateAttributeTypeSchema), updateType);
router.delete("/:id", authenticate, authorize(["super_admin"]), deleteType);

// Values routes
router.get("/:typeId/values", authenticate, authorize(["super_admin"]), getValues);
router.post("/:typeId/values", authenticate, authorize(["super_admin"]), validate(createAttributeValueSchema), createValue);
router.put("/values/:valueId", authenticate, authorize(["super_admin"]), validate(updateAttributeValueSchema), updateValue);
router.delete("/values/:valueId", authenticate, authorize(["super_admin"]), deleteValue);

export default router;