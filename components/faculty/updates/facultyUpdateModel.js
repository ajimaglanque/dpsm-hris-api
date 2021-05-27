const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')

const FacultyUpdates = sequelize.define('faculty_update', {
    // Model attributes are defined here
    facultyId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        primaryKey: true
    },
    lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false
    }
  });

  PersonalInfo.hasMany(FacultyUpdates, {foreignKey: 'facultyId'})
  FacultyUpdates.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = FacultyUpdates