import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validateLogin, validateRegister } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, asyncHandler(authController.register));
router.post("/login", validateLogin, asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;