import { Router } from "express";
import {
  bookService,
  getUserServices,
  cancelService
} from "../controllers/userService.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

// BOOK SERVICE
router.post("/book", protect, bookService);

// GET USER SERVICES
router.get("/", protect, getUserServices);

// CANCEL SERVICE
router.delete("/cancel", protect, cancelService);

export default router;