import mongoose, { Document } from "mongoose";

export interface IUserService extends Document {
  user_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
  created_at?: Date;
}

const userServiceSchema = new mongoose.Schema<IUserService>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const UserService = mongoose.model<IUserService>(
  "UserService",
  userServiceSchema
);

export default UserService;