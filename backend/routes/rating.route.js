import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createRating,
  getRatingsForUser,
  getMyRatingForRequest,
} from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createRating);
router.get("/user/:userId", getRatingsForUser);
router.get("/request/:requestId/me", isAuthenticated, getMyRatingForRequest);

export default router;