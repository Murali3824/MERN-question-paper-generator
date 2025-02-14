import express from "express";
import { generatePaper, getSubjects } from "../controllers/generateController.js";

const router = express.Router();

router.post("/", generatePaper);
router.get("/subjects", getSubjects);

export default router;
