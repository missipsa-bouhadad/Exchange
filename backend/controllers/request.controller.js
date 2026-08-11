import Request from "../models/request.model.js";
import { Ad } from "../models/ad.model.js";
import Chat from "../models/chatModel.js";
import Notification from "../models/notification.model.js";


export const createRequest = async (req, res) => {
  try {
    const { adId, message } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad)
      return res
        .status(404)
        .json({ success: false, error: "Ad not found" });

    if (ad.status === "EXCHANGED")
      return res
        .status(400)
        .json({ success: false, error: "This ad has already been exchanged" });

    const request = await Request.create({
      ad: adId,
      fromUser: req.user._id,
      toUser: ad.user,
      message,
    });

    await Notification.create({
      receiver: ad.user,
      sender: req.user._id,
      type: "REQUEST",
      message: "You received a new request for your ad",
      link: "/dashboard/requests",
    });

    const notif = await Notification.findOne({
      receiver: ad.user,
      sender: req.user._id,
      type: "REQUEST",
    })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName photoUrl");
    if (notif) {
      const { broadcastTo } = await import("../utils/sseHub.js");
      broadcastTo(ad.user, "notification", notif);
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    //console.log("req.user =", req.user);

    const requests = await Request.find({ toUser: req.user._id })
      .populate("fromUser", "firstName lastName email")
      .populate("ad", "title");

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error getReceivedRequests:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ fromUser: req.user._id })
      .populate("toUser", "firstName lastName email")
      .populate("ad", "title");

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error getSentRequests:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId).populate("ad");
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.toUser.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    request.status = "ACCEPTED";
    await request.save();

    // Marquer l'annonce comme échangée
    request.ad.status = "EXCHANGED";
    await request.ad.save();

    const chat = await Chat.create({
      chatName: request.ad.title,
      users: [request.fromUser, request.toUser],
      adDescription: request.ad.description,
      request: request._id,
    });

    res.json({ success: true, chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.toUser.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    request.status = "REJECTED";
    await request.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};