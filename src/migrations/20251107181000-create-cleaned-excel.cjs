"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CleanedExcels", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users", // Reference to Users table
          key: "id",
        },
        onDelete: "CASCADE", // If user deleted, remove related cleaning history
      },
      excelId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "ExcelUploads", // Reference to ExcelUploads table
          key: "id",
        },
        onDelete: "CASCADE", // If original Excel deleted, clean up related records
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cleanedHeaders: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      cleanedData: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      columnActions: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      columnTypes: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}, // Store column types like {"Name": "string", "DOB": "date"}
      },
      nullOptions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}, // Store column types like {"Name": "string", "DOB": "date"}
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CleanedExcels");
  },
};
