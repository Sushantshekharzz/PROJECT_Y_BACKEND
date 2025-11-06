import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.UUID,            // ✅ UUID type
      defaultValue: DataTypes.UUIDV4,  // ✅ automatically generates UUID
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
