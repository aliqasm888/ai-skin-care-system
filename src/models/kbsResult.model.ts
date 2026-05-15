import mongoose, { Document } from "mongoose";

export interface IKBSResult extends Document {
  user_id: mongoose.Types.ObjectId;
  skin_type: "oily" | "dry" | "normal" | "combination";
  created_at?: Date;
}

const kbsResultSchema = new mongoose.Schema<IKBSResult>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skin_type: {
      type: String,
      enum: ["oily", "dry", "normal", "combination"],
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const KBSResult = mongoose.model<IKBSResult>(
  "KBSResult",
  kbsResultSchema
);

export default KBSResult;