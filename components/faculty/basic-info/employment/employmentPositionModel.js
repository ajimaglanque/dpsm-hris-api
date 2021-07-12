const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const EmploymentInfo = require('./employmentInfoModel')

const EmploymentPosition = sequelize.define('faculty_employment_position', {
    // Model attributes are defined here
    employmentPositionId: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    position: {
        type: DataTypes.STRING(21),
        allowNull: false
    }
  });
  
  module.exports = EmploymentPosition