const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../personal/personalInfoModel');
const EmploymentPosition = require('./employmentPositionModel');

const EmploymentInfo = sequelize.define('faculty_employment_info', {
    // Model attributes are defined here
    employmentInfoId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    position: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    endDate: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    }
  });
  
  PersonalInfo.hasMany(EmploymentInfo, {foreignKey: 'facultyId'})
  EmploymentInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  EmploymentInfo.hasOne(EmploymentPosition, {foreignKey: 'employmentPositionId'});
  EmploymentPosition.hasMany(EmploymentInfo, {foreignKey: 'position'})

  module.exports = EmploymentInfo