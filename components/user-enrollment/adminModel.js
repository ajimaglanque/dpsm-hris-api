const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const User = require('./userEnrollmentModel')

const AdminInfo = sequelize.define('admin_info', {
    // Model attributes are defined here
    adminId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
  });

  AdminInfo.belongsTo(User, {foreignKey: 'userId'})
  User.hasMany(AdminInfo, {foreignKey: 'userId'});

  module.exports = AdminInfo