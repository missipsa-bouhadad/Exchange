// controllers/chat.controller.js

import Chat from "../models/chatModel.js";
import { User } from "../models/user.model.js";

export const getChats = async (req, res) => {
  try {
    const userId = req.id; 

    const chats = await Chat.find({ users: { $in: [userId] } })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email",
        },
      });

    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

export const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body; 
    const userId = req.id; 

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let chat = await Chat.findOne({
      users: { $all: [userId, otherUserId] },
    });

    if (chat) {
      return res.status(200).json({
        success: true,
        message: "Chat already exists",
        data: chat,
      });
    }

    //sinon on va créer un chat
    chat = await Chat.create({
      chatName: otherUser.firstName,
      users: [userId, otherUserId],
    });

    return res.status(201).json({
      success: true,
      message: "Chat created",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }
};
