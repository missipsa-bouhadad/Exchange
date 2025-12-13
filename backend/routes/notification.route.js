import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {getNotifications,markNotificationRead,markAllNotificationsAsRead} from "../controllers/notification.controller.js"


const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.patch("/read-all", isAuthenticated, markAllNotificationsAsRead);
router.patch("/:id/read", isAuthenticated, markNotificationRead);


export default router;