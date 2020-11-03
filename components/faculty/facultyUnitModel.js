const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Unit = sequelize.define('faculty_unit', {
    // Model attributes are defined here
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
  });

  module.exports = Unit