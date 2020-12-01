const sequelize = require('../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Researcher = require('./facultyResearcherModel')

const ResearchGrant = sequelize.define('faculty_research_grant', {
    // Model attributes are defined here
    researchGrantId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    researchName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    granter: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    amount: {
        type: DataTypes.STRING(11),
        validate: {
            isNumeric: true
        }
    },
    projectedStart: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    projectedEnd: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    actualStart: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    actualEnd: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        }
    },
    researchProgress: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nonFacultyResearchers: {
        type: DataTypes.STRING(100)
    }
  });

  Researcher.belongsTo(ResearchGrant, {foreignKey: 'researchGrantId'})
  ResearchGrant.hasMany(Researcher, {foreignKey: 'researchId'});
  
  module.exports = ResearchGrant