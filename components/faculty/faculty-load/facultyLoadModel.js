const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')

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
    semester: {
        type: DataTypes.STRING(20),
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
    setResults: {
        type: DataTypes.STRING(150)
    },
    syllabus: {
        type: DataTypes.STRING(150)
    }
  });

  PersonalInfo.hasMany(FacultyLoad, {foreignKey: 'facultyId'})
  FacultyLoad.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = FacultyLoad