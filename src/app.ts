import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import errorHandler from "./middlewares/errorHandler";
import kbsRoutes from "./modules/kbs/kbs.routes";
import serviceRoutes from "./routes/service.routes";
import userServiceRoutes from "./routes/userService.routes";

const app = express();

// ======================
// Middlewares
// ======================
app.use(cors());
app.use(express.json());

// ======================
// 📁 Static Files
// ======================
app.use("/uploads", express.static("uploads"));

// ======================
// Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/kbs", kbsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/user-services", userServiceRoutes);

// ======================
// Error Handler (must be last)
// ======================
app.use(errorHandler);

export default app;