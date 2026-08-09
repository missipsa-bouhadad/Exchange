import { Rating } from "../models/rating.model.js";
import Request from "../models/request.model.js";

export const createRating = async (req, res) => {
  try {
    const { requestId, value, comment } = req.body;

    if (!requestId || !value) {
      return res.status(400).json({
        success: false,
        message: "requestId and value are required",
      });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({
        success: false,
        message: "value must be between 1 and 5",
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "You can only rate after the request is accepted",
      });
    }

    // only the  two involved in the request can rate
    const isFromUser = request.fromUser.toString() === req.id;
    const isToUser = request.toUser.toString() === req.id;
    if (!isFromUser && !isToUser) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to rate this exchange",
      });
    }

    // the other party (the rated)
    const toUser = isFromUser ? request.toUser : request.fromUser;

    try {
      const rating = await Rating.create({
        fromUser: req.id,
        toUser,
        request: requestId,
        value,
        comment: comment || "",
      });

      return res.status(201).json({
        success: true,
        message: "Rating submitted successfully",
        data: rating,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "You have already rated this exchange",
        });
      }
      throw err;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting rating",
    });
  }
};

export const getRatingsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ toUser: userId })
      .populate("fromUser", "firstName lastName photoUrl")
      .sort({ createdAt: -1 });

    const count = ratings.length;
    const avg =
      count === 0
        ? 0
        : Math.round(
            (ratings.reduce((sum, r) => sum + r.value, 0) / count) * 10
          ) / 10;

    return res.status(200).json({
      success: true,
      data: {
        avg,
        count,
        ratings,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching ratings",
    });
  }
};

export const getMyRatingForRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const rating = await Rating.findOne({
      request: requestId,
      fromUser: req.id,
    });

    return res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching rating",
    });
  }
};