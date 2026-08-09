import mongoose from "mongoose";

const ratingSchema = mongoose.Schema(
  {
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
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// a user can only rate once per exchange
ratingSchema.index({ fromUser: 1, request: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);