import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

router.get(
  "/admin/dashboard",
  authenticate,
  authorize(ROLES.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to admin dashboard",
    });
  }
);

router.get(
  "/manager/reports",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Manager reports data",
    });
  }
);

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
);

export default router;