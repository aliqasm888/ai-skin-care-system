import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import { upload } from "../config/multer.config"; // أو حسب مكانه عندك
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// ======================
//  Upload Image
// ======================
router.post(
  "/upload",protect,
  upload.single("file"),
  uploadController.uploadImage
);

// ======================
//  Set Avatar
// ======================
router.post(
  "/avatar",protect,
  uploadController.setAvatar
);

// ======================
//  Delete Image
// ======================
router.post(
  "/delete",protect,
  uploadController.deleteImage
);

export default router;