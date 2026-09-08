import { Router } from "express";
import { register, login } from "./auth.controller";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginUserSchema), login);

export default router;