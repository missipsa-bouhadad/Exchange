import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { sendMessage,getMessages } from "../controllers/message.controller.js"; 

const router=express.Router();

router.post("/",isAuthenticated,sendMessage);
router.get("/:chatId", isAuthenticated, getMessages);


export default router;