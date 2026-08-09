import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const MAX_SIZE = 5 * 1024*1024; // 5 Mo

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new ApiError(400, "Only image files are allowed (jpeg, png, webp, gif)"));
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
}).single("file");

// Wrap multer to translate its errors into proper HTTP responses
export const singleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new ApiError(400, "File too large (max 5 Mo)"));
        }
        return next(new ApiError(400, err.message));
      }
      return next(err);
    }
    next();
  });
};