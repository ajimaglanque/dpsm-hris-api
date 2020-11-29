const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = sequelize.define('faculty_personal_info', {
    // Model attributes are defined here
    facultyId: {
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
    dateOfBirth: {
        type: DataTypes.DATE,
        validate: {
            isDate: true
        },
        allowNull: false
    },
    placeOfBirth: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(6),
        validate: {
            isLowercase: true,
            isIn: [['Male', 'Female']]
        },
        allowNull: false
    },
    permanentAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    presentAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    landline: {
        type: DataTypes.STRING(8),
        validate: {
            isNumeric: true
        }
    },
    mobile: {
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
    },
    civilStatus: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    religion: {
        type: DataTypes.STRING(50)
    },
    emergencyContactPerson: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    emergencyContactNumber: {
        type: DataTypes.STRING(11),
        validate: {
            isNumeric: true
        },
        allowNull: false
    }
  });

  module.exports = PersonalInfo