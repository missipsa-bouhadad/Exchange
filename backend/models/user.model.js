import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    tel: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); //timestamps pour ajouter createdAt et updatedAt


export const User=mongoose.model("User",userSchema)