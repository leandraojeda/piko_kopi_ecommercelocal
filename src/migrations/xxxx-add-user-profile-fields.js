"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "lastname", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });

    await queryInterface.addColumn("Users", "phone", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "lastname");
    await queryInterface.removeColumn("Users", "phone");
    await queryInterface.removeColumn("Users", "city");
  },
};
