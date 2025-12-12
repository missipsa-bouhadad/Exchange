import Request from "../models/request.model.js";
import { Ad } from "../models/ad.model.js";
import Chat from "../models/chatModel.js";


export const createRequest = async (req, res) => {
  try {
    const { adId, message } = req.body;

    const ad = await Ad.findById(adId);
    if (!ad)
      return res
        .status(404)
        .json({ success: false, error: "Annonce introuvable" });

    const request = await Request.create({
      ad: adId,
      fromUser: req.user._id,
      toUser: ad.user,
      message,
    });

    res.json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
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
    console.error("Erreur getReceivedRequests :", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId).populate("ad");
    if (!request) return res.status(404).json({ error: "Demande introuvable" });

    if (request.toUser.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Non autorisé" });

    request.status = "ACCEPTED";
    await request.save();

    const chat = await Chat.create({
      chatName: request.ad.title,
      users: [request.fromUser, request.toUser],
      adDescription: request.ad.description,
    });

    res.json({ success: true, chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};


export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ error: "Demande introuvable" });

    if (request.toUser.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Non autorisé" });

    request.status = "REJECTED";
    await request.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};