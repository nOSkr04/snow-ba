import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    customers: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerType: {
      type: String,
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
    partNomer: {
      type: String,
      required: true,
    },
    gage: {
      type: mongoose.Schema.ObjectId,
      ref: "Gage",
      required: true,
    },
    size: {
      type: mongoose.Schema.ObjectId,
      ref: "Size",
      required: true,
    },
    material: {
      type: mongoose.Schema.ObjectId,
      ref: "Material",
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
    knit: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Knit",
      },
    ],
    knitStatus: {
      type: String,
      default: "Pending",
    },
    knitUsers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "KnitUser",
      },
    ],
    knitResidualCount: {
      type: Number,
      default: 0,
    },
    knitGrantedCount: {
      type: Number,
      default: 0,
    },
    knitEndCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Product", ProductSchema);
