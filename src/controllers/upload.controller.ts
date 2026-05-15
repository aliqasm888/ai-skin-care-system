import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../utils/AppError";
import { sendResponse } from "../utils/apiResponse";
import * as uploadService from "../services/upload.service";
import { MulterRequest } from "../types/multerRequest";
import { Request, Response } from "express";

// ==========================
// 📤 Upload Image (return URL)
// ==========================
export const uploadImage = asyncHandler(
  async (req: MulterRequest, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new AppError("No file uploaded", 400);
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const imageUrl = `${baseUrl}/uploads/${file.filename}`;

    return sendResponse(res, 200, "Image uploaded successfully", {
      imageUrl,
      fileName: file.filename
    });
  }
);

// ==========================
// 👤 Set Avatar (FROM TOKEN)
// ==========================
export const setAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const { imageUrl } = req.body;
    const userId = req.user!.id;

    const user = await uploadService.uploadAvatar(userId, imageUrl);

    return sendResponse(res, 200, "Avatar updated successfully", user);
  }
);

// ==========================
// 🗑️ Delete Image
// ==========================
export const deleteImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileName } = req.body;

    if (!fileName) {
      throw new AppError("fileName is required", 400);
    }

    const result = await uploadService.deleteImage(fileName);

    return sendResponse(res, 200, "Image deleted successfully", result);
  }
);