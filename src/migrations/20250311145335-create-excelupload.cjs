"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ExcelUploads", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // ✅ Postgres-safe UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users", // ✅ links to Users.id
          key: "id",
        },
        onDelete: "CASCADE", // ✅ deletes ExcelUploads when user is deleted
      },
      fileName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      headers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ExcelUploads");
  },
};
