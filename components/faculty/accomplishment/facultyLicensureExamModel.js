const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

const LicensureExam = sequelize.define('faculty_licensure_exam', {
    // Model attributes are defined here
    licenseId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    examName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    examDate: {
        type: DataTypes.STRING,
        validate: {
            isDate: true
        },
        allowNull: false
    },
    licenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER(3)
    },
    proof: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Pending', 'Verified', 'Approved']],
        allowNull: false
    }
  });

  PersonalInfo.hasMany(LicensureExam, {foreignKey: 'facultyId'})
  LicensureExam.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = LicensureExam