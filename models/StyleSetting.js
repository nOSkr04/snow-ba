import mongoose from "mongoose";

const StyleSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Утга заавал оруулна уу"],
  },
  type: {
    type: String,
    enum: ["ModelType", "Gage", "Material", "Ply", "Size", "Detail"],
    required: [true, "Төрөл заавал оруулна уу"],
  },
  value: Number,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StyleSetting", StyleSettingSchema);
