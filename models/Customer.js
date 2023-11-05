import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },
    countryCode: {
      type: String,
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

export default mongoose.model("Customer", CustomerSchema);
