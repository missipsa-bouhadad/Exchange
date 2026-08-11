import Notification from "../models/notification.model.js";
import { addClient, removeClient } from "../utils/sseHub.js";

// SSE endpoint (keeps the connection open and registers the response in the hub)
// The hub pushes new notifications when they are created elsewhere in the app.
export const streamNotifications = async (req, res) => {
  const userId = req.user._id;

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering if proxied
  res.flushHeaders?.();

  // Tell the client the stream is open
  res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);

  addClient(userId, res);

  // ping every 25 sec 
  const ping = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch {
      clearInterval(ping);
    }
  }, 25000);

  const cleanup = () => {
    clearInterval(ping);
    removeClient(userId, res);
  };

  req.on("close", cleanup);
  req.on("aborted", cleanup);
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
          message: "Failed to fetch notifications",
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
      message: "Failed to fetch notification",
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