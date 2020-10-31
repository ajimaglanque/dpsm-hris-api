const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  module.exports = User