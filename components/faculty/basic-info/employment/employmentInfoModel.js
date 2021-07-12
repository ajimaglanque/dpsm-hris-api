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
    employmentPositionId: {
        type: DataTypes.INTEGER(2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(9),
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
  EmploymentPosition.hasMany(EmploymentInfo, {foreignKey: 'employmentPositionId'})
  EmploymentInfo.belongsTo(EmploymentPosition, {foreignKey: 'employmentPositionId'});

  module.exports = EmploymentInfo