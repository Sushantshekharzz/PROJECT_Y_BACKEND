// src/models/ExcelUpload.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ExcelUpload = sequelize.define("ExcelUpload", {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    headers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      
    },
    userId: {
      type: DataTypes.UUID  ,
      allowNull: false,
    },
  });

  return ExcelUpload;
};
