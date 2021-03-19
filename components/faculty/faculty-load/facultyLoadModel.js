const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

const FacultyLoad = sequelize.define('faculty_class_record', {
    // Model attributes are defined here
    recordId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    academicYear: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    section: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    classRecord: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  PersonalInfo.hasMany(FacultyLoad, {foreignKey: 'facultyId'})
  FacultyLoad.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = FacultyLoad