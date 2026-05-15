import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/service.controller";

import { protect } from "../middlewares/auth.middleware";

const router = Router();

// CREATE
router.post("/", protect, createService);

// GET ALL
router.get("/",protect, getAllServices);

// GET BY ID
router.get("/:id",protect, getServiceById);

// UPDATE
router.put("/:id", protect, updateService);

// DELETE
router.delete("/:id", protect, deleteService);

export default router;