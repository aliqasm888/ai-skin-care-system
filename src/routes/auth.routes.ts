import express from "express";
import * as authController from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginSchema, signupSchema } from "../validations/auth.validation";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
const router = express.Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);

router.get("/users", protect, authController.getUsers);
router.delete("/users/:id", protect, authorize("admin"),  authController.deleteUser);
router.put("/users/:id", protect, authController.updateUser);

export default router;