import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    ad: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", required: true },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
