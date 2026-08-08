import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

import {
  createRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createRequest);

router.get("/received", isAuthenticated, getReceivedRequests);
router.get("/sent", isAuthenticated, getSentRequests);

router.post("/:id/accept", isAuthenticated, acceptRequest);
router.post("/:id/reject", isAuthenticated, rejectRequest);

export default router;
