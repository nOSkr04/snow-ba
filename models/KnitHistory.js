import mongoose from "mongoose";

const KnitHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    count: {
      type: Number,
      default: 0,
    },
    complete: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "KnitUser",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("KnitHistory", KnitHistorySchema);
