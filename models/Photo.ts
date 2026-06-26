import { Schema, model, models } from "mongoose";

const PhotoSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    faceCount: {
      type: Number,
      default: 0,
    },

    processed: {
      type: Boolean,
      default: false,
    },
    processingError: {
      type: String,
      default: null,
    },
    width: Number,
    height: Number,
  },
  {
    timestamps: true,
  },
);

export default models.Photo || model("Photo", PhotoSchema);
