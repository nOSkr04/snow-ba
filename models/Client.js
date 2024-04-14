import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  location: String,
  email: String,
  phone: String,
  country: String,
  countryCode: String,
  avatar: String,
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Client", ClientSchema);
