const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Publisher = require('./publisherModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel')

const PublicationInfo = sequelize.define('faculty_publication', {
    // Model attributes are defined here
    publicationId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    citation: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        type: DataTypes.TEXT
    }
  });

  Publisher.belongsTo(PublicationInfo, {foreignKey: 'publicationId'})
  PublicationInfo.hasMany(Publisher, {foreignKey: 'publicationId'});
  
  module.exports = PublicationInfo