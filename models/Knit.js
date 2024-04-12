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
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
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
    knitLink: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Knit", KnitSchema);
