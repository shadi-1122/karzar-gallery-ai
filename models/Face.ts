import mongoose, { Schema } from "mongoose";

const FaceSchema = new Schema(
  {
    photoId: {
      type: Schema.Types.ObjectId,
      ref: "Photo",
      required: true,
    },

    personId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },

    embedding: { type: [Number], required: true },

    confidence: {
      type: Number,
      required: true,
    },

    bbox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Face || mongoose.model("Face", FaceSchema);
