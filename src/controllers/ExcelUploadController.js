// src/controllers/excelUploadController.js
import { ExcelUpload } from "../models/index.js";

// 📤 CREATE — Upload Excel
export const uploadExcelData = async (req, res) => {
  try {
    const { fileName, data, headers } = req.body;
    const userId = req.user.id;

    if (!userId || !fileName || !data) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // 🚫 Prevent duplicate uploads by same user with same file name
    const existing = await ExcelUpload.findOne({
      where: { userId, fileName },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "⚠️ File with same name already uploaded." });
    }

    // ✅ Ensure headers array is present
    let extractedHeaders = headers;
    if (!extractedHeaders && Array.isArray(data) && data.length > 0) {
      extractedHeaders = Object.keys(data[0]);
    }

    const newUpload = await ExcelUpload.create({
      userId,
      fileName,
      data,
      headers: extractedHeaders || [],
    });

    return res.status(201).json({
      message: "✅ Excel data successfully uploaded",
      upload: newUpload,
    });
  } catch (err) {
    console.error("❌ Error uploading Excel data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📄 READ — Get all uploads for logged-in user
export const getAllExcels = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await ExcelUpload.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "✅ Excel uploads fetched successfully",
      uploads,
    });
  } catch (err) {
    console.error("❌ Error fetching Excel uploads:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✏️ UPDATE — Update Excel by ID
export const updateExcelData = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, data, headers } = req.body;
    const userId = req.user.id;

    const upload = await ExcelUpload.findOne({ where: { id, userId } });
    if (!upload) {
      return res.status(404).json({ message: "❌ Excel entry not found" });
    }

    // 🚫 Prevent renaming to an already existing file
    if (fileName && fileName !== upload.fileName) {
      const duplicate = await ExcelUpload.findOne({
        where: { userId, fileName },
      });
      if (duplicate) {
        return res
          .status(409)
          .json({ message: "⚠️ Another file with same name exists." });
      }
    }

    upload.fileName = fileName || upload.fileName;
    upload.data = data || upload.data;
    upload.headers = headers || upload.headers;

    await upload.save();

    return res.status(200).json({
      message: "✅ Excel data updated successfully",
      upload,
    });
  } catch (err) {
    console.error("❌ Error updating Excel data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑️ DELETE — Delete Excel by ID
export const deleteExcelData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const upload = await ExcelUpload.findOne({ where: { id, userId } });
    if (!upload) {
      return res.status(404).json({ message: "❌ Excel entry not found" });
    }

    await upload.destroy();

    return res.status(200).json({
      message: "✅ Excel data deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting Excel data:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
