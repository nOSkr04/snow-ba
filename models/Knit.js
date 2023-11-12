import mongoose from "mongoose";

const KnitSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "KnitUser",
    },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Knit", KnitSchema);
