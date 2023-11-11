import mongoose from "mongoose";

const KnitUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    accept: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
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

export default mongoose.model("KnitUser", KnitUserSchema);
