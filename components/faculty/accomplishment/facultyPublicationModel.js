const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Publisher = require('./facultyPublisherModel')
const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

const PublicationInfo = sequelize.define('faculty_publication', {
    // Model attributes are defined here
    publicationId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    citation: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING(50),
        validate: {
            isUrl: true
        }
    },
    publicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    nonFacultyAuthors: {
        type: DataTypes.STRING(150)
    }
  });

  Publisher.belongsTo(PublicationInfo, {foreignKey: 'publicationId'})
  PublicationInfo.hasMany(Publisher, {foreignKey: 'publicationId'});
  
  module.exports = PublicationInfo