import express from "express";
import cookieParser from "cookie-parser";  
import { sequelize } from "./models/index.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import excelUploadRoutes from "./routes/excelUploadRoutes.js";
import excelCleanRoutes from "./routes/excelCleanRoutes.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: "http://localhost:5173", // <-- your frontend URL
  credentials: true,               // <-- allow cookies
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // 👈 necessary for JSON payloads (especially large Excel)
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/excel-upload", excelUploadRoutes)

app.use("/api/excel-clean", excelCleanRoutes)




const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB error:", err);
  }
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
