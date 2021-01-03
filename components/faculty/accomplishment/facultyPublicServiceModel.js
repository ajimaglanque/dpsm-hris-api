const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

const PublicServiceInfo = sequelize.define('faculty_public_service', {
    // Model attributes are defined here
    publicServiceId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING(10),
        isIn: [['Within UPM', 'Profession', 'Nation', 'World']],
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    organization: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    startDate: {
        type: DataTypes.STRING,
        validate: {
            isDate: true
        },
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    proof: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Pending', 'For Verification', 'Verified']],
        allowNull: false
    }
  });

  PublicServiceInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'})
  PersonalInfo.hasMany(PublicServiceInfo, {foreignKey: 'facultyId'});
  
  module.exports = PublicServiceInfo