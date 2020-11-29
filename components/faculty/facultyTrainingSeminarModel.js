const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./facultyPersonalInfoModel')

const TrainingSeminar = sequelize.define('faculty_training_seminar', {
    // Model attributes are defined here
    tsId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dateFrom: {
        type: DataTypes.STRING,
        validate: {
            isDate: true
        },
        allowNull: false
    },
    dateTo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    venue: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    proof: {
        type: DataTypes.STRING(100)
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Pending', 'For Verification', 'Verified']],
        allowNull: false
    }
  });

  PersonalInfo.hasMany(TrainingSeminar, {foreignKey: 'facultyId'})
  TrainingSeminar.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = TrainingSeminar