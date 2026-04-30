import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary } from './cloudinary.js'
import path from "path"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `${Date.now()}-${path.parse(file.originalname).name}`
  },
})

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/webp") {
      return cb(null, true)
    } else {
      cb(new Error("Error type of image"))
    }
  },
  limits: {fileSize: 100000000}
})