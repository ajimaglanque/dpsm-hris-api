const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

const Evaluation = sequelize.define('faculty_evaluation', {
    // Model attributes are defined here
    evaluationId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    academicYear: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    evaluation: {
        type: DataTypes.FLOAT(3, 2),
        allowNull: false
    }
  });

  PersonalInfo.hasMany(Evaluation, {foreignKey: 'facultyId'})
  Evaluation.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  PersonalInfo.hasMany(Evaluation, {foreignKey: 'evaluatee'})
  Evaluation.belongsTo(PersonalInfo, {foreignKey: 'evaluatee'});
  
  module.exports = Evaluation