import mongoose from "mongoose";
import { type } from "os";

const KnitSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 0,
  },
  barcode: {
    type: String,
  },
  status: {
    type: String,
    enum: ["working", "done"],
  },
  excel: String,
  pdf: String,
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
  },
  sewWeight: {
    type: String,
    default: 0,
  },
  knitter: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Knit", KnitSchema);
