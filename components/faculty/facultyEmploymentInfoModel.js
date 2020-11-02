const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./facultyPersonalInfoModel')
const Unit = require('./unitModel')

const EmploymentInfo = sequelize.define('faculty_employment_info', {
    // Model attributes are defined here
    employmentInfoId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    unitId: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50),
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

  EmploymentInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  EmploymentInfo.belongsTo(Unit, {foreignKey: 'unitId'});
  
  module.exports = EmploymentInfo