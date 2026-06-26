import mongoose, { Schema } from "mongoose";

const PersonSchema = new Schema(
  {
    representativeEmbedding: {
      type: [Number],
      required: true,
    },

    representativePhoto: {
      type: Schema.Types.ObjectId,
      ref: "Photo",
      required: true,
    },

    representativeFace: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },

    photoCount: {
      type: Number,
      default: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

PersonSchema.index({ active: 1 });

export default mongoose.models.Person || mongoose.model("Person", PersonSchema);
