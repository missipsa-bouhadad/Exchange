import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // On garde ce que tu avais
    req.id = decode.userId;

    // 👉 On ajoute ceci pour ton système de requests
    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user; // 👈 ESSENTIEL

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      message: "Authentication error",
      success: false,
    });
  }
};
