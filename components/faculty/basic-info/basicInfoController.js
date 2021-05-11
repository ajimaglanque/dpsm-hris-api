// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../helpers/util');

const PersonalInfo = require('./personal/personalInfoModel')
const FacultyUnit = require('./unit/facultyUnitModel');
const EducationInfo = require('./education/educationInfoModel')
const EmploymentInfo = require('./employment/employmentInfoModel')
const WorkExpInfo = require('./work-exp/workExpInfoModel')
const Unit = require('./unit/unitModel');

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
        let where = {}
        if(req.query.unitId) {
            where = {
                unitId: req.query.unitId
            }
        }
        
        facultyList = await Unit.findAll({
            where: where,
            attributes: ['unitId', 'unit'],
            include: 
                {
                    model: FacultyUnit,
                    attributes: ['facultyId'],
                    include: 
                        {
                            model: PersonalInfo,
                            attributes: ['lastName','firstName','middleName']
                        }
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
        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }
        facultyList = await PersonalInfo.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
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
                    model: EmploymentInfo,
                    attributes: {
                        exclude: ['employmentInfoId', 'facultyId', 'createdAt', 'updatedAt']
                    },
                    
                },
                {
                    model: EducationInfo,
                    attributes: {
                        exclude: ['educInfoId', 'facultyId', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: WorkExpInfo,
                    attributes: {
                        exclude: ['workExpId', 'facultyId', 'createdAt', 'updatedAt']
                    }
                }
            ],
            order: [
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
                [EmploymentInfo, 'startDate', 'DESC'],
                [EducationInfo, 'startDate', 'DESC'],
                [WorkExpInfo, 'endDate', 'DESC'],
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