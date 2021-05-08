const sequelize = require('../../../../helpers/mysql-db-helper');
const { DataTypes } = require('sequelize');

const PersonalInfo = require('../../basic-info/personal/personalInfoModel')

const Researcher = sequelize.define('faculty_researcher', {
    // Model attributes are defined here
    researcherId: {
        type: DataTypes.INTEGER(8),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    researchId: {
        type: DataTypes.INTEGER(8),
        allowNull: false
    },
    proof: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING(20),
        isIn: [['Pending', 'Verified', 'Approved']]
    }
  });

  PersonalInfo.hasMany(Researcher, {foreignKey: 'facultyId'})
  Researcher.belongsTo(PersonalInfo, {foreignKey: 'facultyId'});
  
  module.exports = Researcher