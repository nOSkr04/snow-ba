import mongoose from "mongoose";

const Order = new mongoose.Schema({
  style: {
    type: mongoose.Schema.ObjectId,
    ref: "Style",
    required: [true, "Загвар заавал оруулна уу"],
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: [true, "Харилцагч заавал оруулна уу"],
  },
  customerType: {
    type: String,
    required: [true, "Захиалгын загвар заавал оруулна уу"],
  },
  daimond: String,
  deadline: {
    type: Date,
    required: [true, "Ачилтын огноо заавал оруулна уу"],
  },
  quantity: {
    type: Number,
    required: [true, "Ширхэг заавал оруулна уу"],
  },
  size: {
    type: String,
    required: [true, "Размер заавал оруулна уу"],
  },
  orderType: {
    type: String,
    required: [true, "Захиалгын төрөл оруулна уу"],
    enum: ["repair", "mass", "excitement"],
  },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", Order);