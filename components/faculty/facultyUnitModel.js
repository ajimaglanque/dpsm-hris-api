const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');
const PersonalInfo = require('./facultyPersonalInfoModel')
const Unit = require('./unitModel')

const FacultyUnit = sequelize.define('faculty_unit', {
    // Model attributes are defined here
    facultyId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    unitId: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    }
  });

    PersonalInfo.hasOne(FacultyUnit, {foreignKey: 'facultyId'})
    FacultyUnit.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
    Unit.hasMany(FacultyUnit, {foreignKey: 'unitId'})
    FacultyUnit.belongsTo(Unit, {foreignKey: 'unitId'});

  module.exports = FacultyUnit