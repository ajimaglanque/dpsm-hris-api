const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = sequelize.define('alumni_personal_info', {
    // Model attributes are defined here
    alumniId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING(11),
        validate: {
            isNumeric: true
        },
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(6),
        validate: {
            isEmail: true
        },
        unique: true,
        allowNull: false
    }
  });

  module.exports = PersonalInfo