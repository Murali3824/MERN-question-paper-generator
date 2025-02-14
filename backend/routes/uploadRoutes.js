import express from "express";
import multer from "multer";
import { uploadQuestions } from "../controllers/uploadController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Excel file
router.post("/", upload.single("file"), uploadQuestions);

export default router;