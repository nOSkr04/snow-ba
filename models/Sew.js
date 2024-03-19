import mongoose from "mongoose";

const SewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    knitHistory: {
      type: mongoose.Schema.ObjectId,
      ref: "KnitHistory",
    },
    barCode: {
      type: String,
    },
    barcodeNumber: String,
    status: String,
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

export default mongoose.model("Sew", SewSchema);
