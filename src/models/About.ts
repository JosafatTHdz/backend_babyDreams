import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  quienesSomos: string;
  mision: string;
  vision: string;
  antecedentes: string;
}

const AboutSchema = new Schema<IAbout>(
  {
    quienesSomos: { type: String, required: true },
    mision: { type: String, required: true },
    vision: { type: String, required: true },
    antecedentes: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAbout>("About", AboutSchema);