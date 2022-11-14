const sequelize = require('../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const User = require('./userEnrollmentModel')

const UserImage = sequelize.define('user_image', {
    // Model attributes are defined here
    imageId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
  });
  UserImage.sync()
  UserImage.belongsTo(User, {foreignKey: 'userId'})

module.exports = UserImage