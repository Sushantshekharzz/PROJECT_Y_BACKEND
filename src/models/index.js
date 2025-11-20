import { Sequelize } from "sequelize";
import UserModel from "./User.js"
import ExcelUploadModel from "./ExcelUpload.js"
import CleanedExcelModel from "./CleanedExcel.js"
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 5432
  }
);

const User = UserModel(sequelize);
const ExcelUpload = ExcelUploadModel(sequelize);
const CleanedExcel = CleanedExcelModel(sequelize);


// User ↔ ExcelUpload
User.hasMany(ExcelUpload, { foreignKey: "userId" });
ExcelUpload.belongsTo(User, { foreignKey: "userId" });

// User ↔ CleanedExcel
User.hasMany(CleanedExcel, { foreignKey: "userId" });
CleanedExcel.belongsTo(User, { foreignKey: "userId" });

// ExcelUpload ↔ CleanedExcel
ExcelUpload.hasMany(CleanedExcel, { foreignKey: "excelId" });
CleanedExcel.belongsTo(ExcelUpload, { foreignKey: "excelId" });


export { sequelize, User, ExcelUpload , CleanedExcel};
