import express from "express";
import {
  uploadExcelData,
  getAllExcels,
  updateExcelData,
  deleteExcelData,
} from "../controllers/ExcelUploadController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/upload-excel", verifyToken, uploadExcelData);

// READ — Get all Excel uploads for the logged-in user
router.get("/all", verifyToken, getAllExcels);

// UPDATE — Update Excel by ID
router.put("/update/:id", verifyToken, updateExcelData);

// DELETE — Delete Excel by ID
router.delete("/delete/:id", verifyToken, deleteExcelData);

export default router;
