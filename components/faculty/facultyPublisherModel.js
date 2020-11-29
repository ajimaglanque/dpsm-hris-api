const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./facultyPersonalInfoModel')

const PublisherInfo = sequelize.define('faculty_publisher', {
    // Model attributes are defined here
    publicationId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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

  PersonalInfo.hasMany(PublisherInfo, {foreignKey: 'facultyId'})
  PublisherInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = PublisherInfo