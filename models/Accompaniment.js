import mongoose from "mongoose";

const AccompanimentSchema = new mongoose.Schema({
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
  knitWeight: {
    type: String,
    default: 0,
  },
  sewWeight: {
    type: String,
    default: 0,
  },
  knitter: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  tailor: {
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

export default mongoose.model("Accompaniment", AccompanimentSchema);
