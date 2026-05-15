import User from "../models/User";
import AppError from "../utils/AppError";
import fs from "fs";
import path from "path";

// ==========================
// 📤 Set Avatar (DB Update)
// ==========================
export const uploadAvatar = async (userId: string, imageUrl: string) => {
  const user = await User.findById(userId);

  if (!imageUrl) {
    throw new AppError("imageUrl is required", 400);
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const baseUrl = process.env.BASE_URL || "";

  if (!imageUrl.startsWith(baseUrl)) {
    throw new AppError("Invalid image URL", 400);
  }

  user.avatar = imageUrl;

  await user.save();

  return user;
};

// ==========================
//  Delete Image
// ==========================
export const deleteImage = async (fileName: string) => {
  try {
    if (!fileName) {
      throw new AppError("File name required", 400);
    }

    const safeFileName = path.basename(fileName);

    const fullPath = path.join(process.cwd(), "uploads", safeFileName);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }

    return {
      success: true,
      message: "Image deleted successfully"
    };
  } catch (err) {
    throw new AppError("Failed to delete image", 500);
  }
};