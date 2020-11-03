const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./alumniPersonalInfoModel')

const WorkExpInfo = sequelize.define('alumni_work_exp_info', {
    // Model attributes are defined here
    workExpId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    employerName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
  });

  WorkExpInfo.belongsTo(PersonalInfo, {foreignKey: 'alumniId'});
  
  module.exports = WorkExpInfo