const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./personalInfoModel')

const Dependent = sequelize.define('faculty_dependent', {
    // Model attributes are defined here
    dependentId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    relationship: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
  });

  PersonalInfo.hasMany(Dependent, {foreignKey: 'facultyId'})
  Dependent.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = Dependent