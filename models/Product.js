import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    customers: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    modelNomer: {
      type: String,
      required: true,
    },
    modelType: {
      type: mongoose.Schema.ObjectId,
      ref: "ModelType",
      required: true,
    },
    colorCode: {
      type: String,
      required: true,
    },
    colorLength: {
      type: String,
      required: true,
    },
    partNomer: {
      type: String,
      required: true,
    },
    gage: {
      type: mongoose.Schema.ObjectId,
      ref: "Gage",
      required: true,
    },
    ply: {
      type: mongoose.Schema.ObjectId,
      ref: "Ply",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    completed: {
      type: Number,
      default: 0,
    },
    image: {
      url: String,
      blurHash: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    deadline: {
      type: Date,
      required: true,
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

export default mongoose.model("Product", ProductSchema);
