const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Role = require('./roleModel')

const User = sequelize.define('user', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Inactive', 'Active', 'Retired', 'Resigned']],
        allowNull: false
    },
    upemail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
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