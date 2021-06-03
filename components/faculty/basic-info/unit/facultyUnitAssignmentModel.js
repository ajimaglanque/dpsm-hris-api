const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');
const PersonalInfo = require('../personal/personalInfoModel')
const Unit = require('./unitModel')

const FacultyUnitAssignment = sequelize.define('faculty_unit_assignment', {
    // Model attributes are defined here
    unitId: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        primaryKey: true
    },
    incomingUnitHead: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        unique: true
    },
    approverRemarks: {
        type: DataTypes.STRING(200)
    }
  });

    PersonalInfo.hasOne(FacultyUnitAssignment, {foreignKey: 'incomingUnitHead'})
    FacultyUnitAssignment.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
    Unit.hasOne(FacultyUnitAssignment, {foreignKey: 'unitId'})
    FacultyUnitAssignment.belongsTo(Unit, {foreignKey: 'unitId'});

  module.exports = FacultyUnitAssignment