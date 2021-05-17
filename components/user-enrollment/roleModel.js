const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Role = sequelize.define('role', {
    // Model attributes are defined here
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
  });

  module.exports = Role