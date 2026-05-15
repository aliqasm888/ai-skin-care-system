import mongoose, { Document } from "mongoose";

export interface IService extends Document {
  title: string;
  description: string;
  image: string;
  duration: number;
  price: number;
  benefits: string[];
  is_recommended: boolean;
  recommended_reason?: string;
}

const serviceSchema = new mongoose.Schema<IService>(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    image: { type: String, required: true },

    duration: { type: Number, required: true },

    price: { type: Number, required: true },

    benefits: { type: [String], default: [] },

    is_recommended: { type: Boolean, default: false },
    
    recommended_reason: { type: String, default: "" }
  },
  { timestamps: true }
);

const Service = mongoose.model<IService>("Service", serviceSchema);

export default Service;