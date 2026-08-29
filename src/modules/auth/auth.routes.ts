import { Router } from "express";
import { register } from "./auth.controller";
import { registerUserSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();
router.post("/register", validate(registerUserSchema), register);

export default router;