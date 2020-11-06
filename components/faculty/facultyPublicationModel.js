const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('./facultyPersonalInfoModel')

const PublicationInfo = sequelize.define('faculty_publication', {
    // Model attributes are defined here
    publicationId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    publication: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    publicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    }
  });

  PersonalInfo.hasMany(PublicationInfo, {foreignKey: 'facultyId'})
  PublicationInfo.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = PublicationInfo