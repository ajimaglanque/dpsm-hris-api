const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const Unit = require('../faculty/facultyUnitModel')

const Program = sequelize.define('student_program', {
    // Model attributes are defined here
    programId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    classification: {
        type: DataTypes.STRING(9),
        allowNull: false,
        validate: {
            isIn: [['undergrad', 'ms', 'phd']]
        }
    },
    program: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
  });

  Program.belongsTo(Unit, {foreignKey: 'unitId'});

  module.exports = Program