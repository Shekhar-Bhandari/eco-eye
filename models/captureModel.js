import mongoose from "mongoose";

const CapturedImageSchema = new mongoose.Schema({
  image: {
    type: String, // base64 image string
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  location: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CapturedImage", CapturedImageSchema);
