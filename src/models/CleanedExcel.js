import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CleanedExcel = sequelize.define("CleanedExcel", {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleanedData: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    cleanedHeaders: {
      type: DataTypes.JSONB, // Keep consistent with migration
      allowNull: false,
    },
    nullOptions:{
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    columnActions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    columnTypes: {
      type: DataTypes.JSONB, // Store detected column types like {"Name": "string", "DOB": "date"}
      allowNull: false,
      defaultValue: {},
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    excelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "ExcelUploads",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return CleanedExcel;
};
