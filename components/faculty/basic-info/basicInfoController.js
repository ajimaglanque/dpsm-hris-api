// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../helpers/util');
const { Op, where } = require('sequelize');

const PersonalInfo = require('./personal/personalInfoModel')
const FacultyUnit = require('./unit/facultyUnitModel');
const Unit = require('./unit/unitModel');
const FacultyUpdates = require('../updates/facultyUpdateModel');
const User = require('../../user-enrollment/userEnrollmentModel')
const Employment = require('./employment/employmentInfoModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.getAllFaculty = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList
        let unitwhere = {}
        let where = {}
        let empwhere = {}
        let userwhere = {}

        if(req.query.unitId) {
            unitwhere.unitId = req.query.unitId
        }

        if(req.query.facultyId) {
            where = {facultyId: { [Op.ne]: req.query.facultyId } }
        }

        if(req.query.status && req.query.status=='ft') {
            empwhere.status = 'Full-time'
            empwhere.category = 'Permanent'
            empwhere.endDate = null
            userwhere.status = 'Active'
        }
        
        facultyList = await Unit.findAll({
            where: unitwhere,
            attributes: ['unitId', 'unit'],
            include: 
                {
                    model: FacultyUnit,
                    attributes: ['facultyId'],
                    where: where,
                    include: 
                        {
                            model: PersonalInfo,
                            attributes: ['facultyId', 'lastName','firstName','middleName'],
                            include: [
                                {
                                    model: Employment,
                                    where: empwhere,
                                    attributes: ['status', 'category']
                                },
                                {
                                    model: FacultyUpdates,
                                    attributes:['updatedAt']
                                },
                                {
                                    model: User,
                                    where: userwhere,
                                    attributes: ['userId', 'status', 'remarks']
                                }
                            ]
                        },
                },
            order: [
                ['unit'],
                [FacultyUnit, PersonalInfo, 'lastName'],
                [FacultyUnit, PersonalInfo, 'firstName'],
                [FacultyUnit, PersonalInfo, 'middleName']
            ]
        });   

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
            }; 
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes);    
    }
};

faculty.getAllFacultyInfo = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 
        let unitIdWhere = {}
        let where = {}
        let empwhere = {}
        let userwhere = {}
        
        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }

        if(req.query.facultyId) {
            where = {facultyId: { [Op.ne]: req.query.facultyId } }
        }

        if(req.query.status && req.query.status=='ft') {
            empwhere.status = 'Full-time'
            empwhere.category = 'Permanent'
            empwhere.endDate = null
            userwhere.status = 'Active'
        }

        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'userId', 'lastName', 'firstName', 'middleName'],
            where: where,
            include: [
                {
                    model: Employment,
                    where: empwhere,
                    attributes: ['status', 'category']
                },
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: unitIdWhere
                },
                {
                    model: User,
                    where: userwhere,
                    attributes: ['userId']
                }
            ],
            order: [
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC']
            ]
          });

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
            }; 
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes);    
    }
};

module.exports = faculty;