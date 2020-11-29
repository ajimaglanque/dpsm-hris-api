const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const EmploymentInfo = require('./facultyEmploymentInfoModel')

const EmploymentPosition = sequelize.define('faculty_employment_position', {
    // Model attributes are defined here
    employmentPositionId: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    employmentType: {
        type: DataTypes.STRING(3),
        allowNull: false,
        validate: {
            isIn: [['ftt', 'ftp', 'pt']]
        }
    },
    position: {
        type: DataTypes.STRING(21),
        allowNull: false
    }
  });
  
  EmploymentPosition.hasMany(EmploymentInfo, {foreignKey: 'employmentPositionId'})
  EmploymentInfo.belongsTo(EmploymentPosition, {foreignKey: 'position'});

  module.exports = EmploymentPosition