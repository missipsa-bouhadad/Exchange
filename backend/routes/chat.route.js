import express from "express";
import { getChats, createChat } from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getChats);
router.post("/", isAuthenticated, createChat);

export default router;
