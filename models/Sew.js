import mongoose from "mongoose";

const SewSchema = new mongoose.Schema(
  {
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
    daimond: String,
    knit: {
      type: mongoose.Schema.ObjectId,
      ref: "Knit",
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

export default mongoose.model("Sew", SewSchema);
