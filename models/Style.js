import mongoose from "mongoose";

const Style = new mongoose.Schema({
  modelType: {
    type: mongoose.Schema.ObjectId,
    ref: "StyleSetting",
    required: [true, "Загвар төрөл заавал оруулна уу"],
  },
  gage: {
    type: mongoose.Schema.ObjectId,
    ref: "StyleSetting",
    required: [true, "Гэйж заавал оруулна уу"],
  },
  material: {
    type: mongoose.Schema.ObjectId,
    ref: "StyleSetting",
    required: [true, "Түүхий эд заавал оруулна уу"],
  },
  ply: {
    type: mongoose.Schema.ObjectId,
    ref: "StyleSetting",
    required: [true, "Утас заавал оруулна уу"],
  },
  modelNomer: {
    type: String,
    required: [true, "Загвар заавал оруулна уу"],
  },
  size: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "StyleSetting",
      required: [true, "Размер заавал оруулна уу"],
    },
  ],
  colorCode: {
    type: String,
    required: [true, "Загвар заавал оруулна уу"],
  },

  partNomer: {
    type: String,
    required: [true, "Парт заавал оруулна уу"],
  },
  image: {
    type: String,
    default: "no-image.jpg",
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

export default mongoose.model("Style", Style);
