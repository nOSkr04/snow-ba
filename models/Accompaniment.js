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
  knitStatus: {
    type: String,
    enum: ["working", "done"],
  },
  sewStatus: {
    type: String,
    enum: ["working", "done"],
  },
  availableSew: {
    type: Boolean,
    default: false,
  },
  availableExecutive: {
    type: Boolean,
    default: false,
  },
  availableDoneExecutive: {
    type: Boolean,
    default: false,
  },
  availableKnit: {
    type: Boolean,
    default: false,
  },
  executiveStatus: {
    type: String,
    enum: ["working", "done"],
  },
  executiveDoneStatus: {
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
  executiveWeight: {
    type: String,
    default: 0,
  },
  executiveDoneWeight: {
    type: String,
    default: 0,
  },
  knitter: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  sewer: {
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
