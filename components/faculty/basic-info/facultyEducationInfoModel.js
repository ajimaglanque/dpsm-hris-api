const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./facultyPersonalInfoModel')

const EducationInfo = sequelize.define('faculty_education_info', {
    // Model attributes are defined here
    educInfoId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    institutionSchool: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    degreeType: {
        type: DataTypes.STRING(10),
        validate: {
            isIn: ['AA', 'AS', 'BA', 'BS', 'MA', 'MS', 'MD', 'PhD']
        }
    },
    degreeCert: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    majorSpecialization: {
        type: DataTypes.STRING(50)
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
    },
    proof: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Pending', 'For Verification', 'Verified']],
        allowNull: false
    }
  });

  PersonalInfo.hasMany(EducationInfo, {foreignKey: 'facultyId'})
  EducationInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = EducationInfo