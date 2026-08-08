import Notification from "../models/notification.model.js";

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