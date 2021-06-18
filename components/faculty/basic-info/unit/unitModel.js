const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');
const PersonalInfo = require('../personal/personalInfoModel')

const Unit = sequelize.define('unit', {
    // Model attributes are defined here
    unitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    incomingUnitHead: {
        type: DataTypes.INTEGER(8),
        unique: true
    },
    approverRemarks: {
        type: DataTypes.STRING(200)
    }
  });

    PersonalInfo.hasOne(Unit, {foreignKey: 'facultyId'})
    Unit.belongsTo(PersonalInfo, {foreignKey: 'incomingUnitHead'});

  module.exports = Unit
