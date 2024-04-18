import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  accompaniment: {
    type: mongoose.Schema.ObjectId,
    ref: "Accompaniment",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Pdf", PdfSchema);
