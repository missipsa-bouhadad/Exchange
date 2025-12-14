import Notification from "../models/notification.model.js";
import {Ad} from "../models/ad.model.js";
import Request from "../models/request.model.js";

export const createRequest = async (req, res) => {
  try {
    const { adId, message } = req.body;

    const ad = await Ad.findById(adId).populate("user");
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad not found" });
    }

    const request = await Request.create({
      ad: adId,
      sender: req.user._id,
      receiver: ad.user._id,
      message,
    });

    await Notification.create({
      receiver: ad.user._id,
      sender: req.user._id, 
      type: "REQUEST",
      message: "You received a new request for your announcement",
      link: "/dashboard/requests",
    });

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating request",
    });
  }
};

export const getNotifications=async(req,res )=>{
    try {
        const notifications=await Notification.find({receiver:req.user._id})
        .populate("sender","firstName lastName photoUrl").sort({createdAt:-1})

        res.status(200).json({
          success: true,
          notifications,
        });
    } catch (error) {
        res.status(500).json({
          success: false,
          message: "erreur lors de la récupération des notifications",
        });
    }
} 

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate({_id:req.params.id, receiver: req.user._id },{isRead:true},{new:true})

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "erreur lors de la récupération de la notification",
    });
  }
}; 

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};