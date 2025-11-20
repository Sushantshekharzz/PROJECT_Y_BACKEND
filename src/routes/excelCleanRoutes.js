import { verifyToken } from "../middlewares/authMiddleware.js";
import { cleanExcel ,getAllCleanedExcels, deleteCleanedExcelData} from "../controllers/ExcelCleanController.js";
const router = express.Router();
import express from "express";



router.post("/clean-excel", verifyToken, cleanExcel);
router.get("/get-clean-excel", verifyToken, getAllCleanedExcels);
router.delete("/delete/:id", verifyToken, deleteCleanedExcelData);


export default router;
