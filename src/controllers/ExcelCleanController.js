// POST /api/clean-excel
import { CleanedExcel, ExcelUpload } from "../models/index.js";
import { analyzeExcel } from "./aiController.js";

/***********************
 *  MAIN CONTROLLER
 ***********************/
export const cleanExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { excelId, columnActions, columnTypes, nullOptions } = req.body;





    if (!excelId || !columnActions || !columnTypes) {
      return res.status(400).json({ message: "Missing data" });
    }

    const excel = await ExcelUpload.findByPk(excelId);

    if (!excel) return res.status(404).json({ message: "Excel not found" });

       const aiInsight  = await analyzeExcel(excel.data);
   console.log("aiInsight",aiInsight)

    // 🔥 Perform Cleaning
    const cleanedData = performCleaning(
      excel.data,
      columnActions,
      columnTypes,
      nullOptions || {}
    );

    // Versioning
    const previousVersions = await CleanedExcel.count({ where: { excelId } });
    const version = previousVersions + 1;

    const cleanedFileName = `cleaned_${excel.fileName}_v${version}`;

    // Save cleaned data
    await CleanedExcel.create({
      fileName: cleanedFileName,
      cleanedHeaders: excel.headers,
      cleanedData,
      columnActions,
      columnTypes,
      excelId,
      userId,
      nullOptions
    });

    res.json({ message: "Cleaning applied", data: cleanedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cleaning failed", error: err.message });
  }
};

/***********************
 *  GARBAGE CHECKERS
 ***********************/





/***********************
 *   CLEANING ENGINE
 ***********************/
export const performCleaning = (
  inputData,
  columnActions,
  columnTypes,
  nullOptions
) => {
  if (!inputData || !Array.isArray(inputData)) return [];

  const data = JSON.parse(JSON.stringify(inputData)); // Deep clone
  const columns = Object.keys(columnActions);

  /***********************************************************
   * FIRST PASS — MARK ROWS FOR DELETION
   ***********************************************************/
  data.forEach((row) => {
    row.__deleteRow = false; // initialize
  });

  const duplicateTracker = {}; // per-column duplicate sets

  columns.forEach((col) => {
    duplicateTracker[col] = new Set();
  });

  /***********************************************************
   * APPLY COLUMN ACTIONS
   ***********************************************************/
  columns.forEach((col) => {
    const actions = columnActions[col];
    if (!actions || actions.length === 0) return;

    const type = columnTypes[col] || "string";

    /********************** REMOVE NULL *************************/
  if (actions.includes("removeNull")) {
    data.forEach((row) => {
      const value = row[col];
      const mode = nullOptions[col]?.mode || "removeRow";
      const replaceValue = nullOptions[col]?.value || "";

      // Only consider empty, null, or undefined as null
      const isNull = value === null || value === undefined || value === "";

      if (isNull) {
        if (mode === "replace") {
          row[col] = replaceValue;
        } else {
          row.__deleteRow = true; // ❌ Remove entire row
        }
      }
    });
  }


    /********************** STRING TRIM *************************/
    if (actions.includes("trim") && type === "string") {
      data.forEach((row) => {
        if (typeof row[col] === "string") row[col] = row[col].trim();
      });
    }

    /**************** LOWERCASE / UPPERCASE *********************/
    if (actions.includes("lowercase") && type === "string") {
      data.forEach((row) => {
        if (typeof row[col] === "string") row[col] = row[col].toLowerCase();
      });
    }

    if (actions.includes("uppercase") && type === "string") {
      data.forEach((row) => {
        if (typeof row[col] === "string") row[col] = row[col].toUpperCase();
      });
    }

    /********************** REMOVE DUPLICATES ******************/
    if (actions.includes("removeDuplicates")) {
      data.forEach((row) => {
        const val = row[col];

        if (val !== null && val !== undefined && val !== "") {
          if (duplicateTracker[col].has(val)) {
            row.__deleteRow = true; // ❌ Entire row removed
          } else {
            duplicateTracker[col].add(val);
          }
        }
      });
    }

    /********************** REMOVE GARBAGE *********************/
   if (actions.includes("removeGarbage")) {
  data.forEach((row) => {
    const value = row[col];
    let isGarbage = false;

    if (type === "string" && typeof value !== "string") {
      isGarbage = true;
    } else if (type === "number" && typeof value !== "number") {
      isGarbage = true;
    } else if (type === "date") {
      // Assuming value is a Date object or valid date string
const parseDate = (value) => {
  if (!value || typeof value !== "string") return value;

  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return value;

  const [, dd, mm, yyyy] = match;
  return new Date(+yyyy, +mm - 1, +dd);
};

const parsedDate = parseDate(value);

if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
  isGarbage = true;
}    }

    if (isGarbage) {
      row.__deleteRow = true; // Mark row for deletion
    }
  });
}

  });

  /***********************************************************
   * FINAL STEP — REMOVE MARKED ROWS
   ***********************************************************/
  const cleaned = data.filter((row) => !row.__deleteRow);

  cleaned.forEach((row) => delete row.__deleteRow);

  return cleaned;
};


export const getAllCleanedExcels = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await CleanedExcel.findAll({
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

export const  deleteCleanedExcelData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const upload = await CleanedExcel.findOne({ where: { id, userId } });
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
