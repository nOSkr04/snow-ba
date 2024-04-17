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
    type: mongoose.Schema.ObjectId,
    ref: "StyleSetting",
    required: [true, "Размер заавал оруулна уу"],
  },
  orderType: {
    type: String,
    required: [true, "Захиалгын төрөл оруулна уу"],
    enum: ["repair", "mass", "excitement"],
  },
  order: {
    type: String,
    enum: ["waiting", "working", "done"],
  },

  completed: {
    type: Number,
    default: 0,
  },
  knitWeight: {
    type: Number,
    default: 0,
  },
  knitingStatus: {
    type: String,
    default: "waiting",
    enum: ["waiting", "working", "done"],
  },
  knitResidualCount: {
    type: Number,
    default: 0,
  },
  knitGrantedCount: {
    type: Number,
    default: 0,
  },
  knitCompletedCount: {
    type: Number,
    default: 0,
  },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  knitProcessUser: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      quantity: Number,
    },
  ],
  knitCompleteUser: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      quantity: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", Order);
