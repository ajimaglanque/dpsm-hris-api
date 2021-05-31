// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../helpers/util');
const { Op } = require('sequelize');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')
const FacultyUnit = require('../basic-info/unit/facultyUnitModel');
const Unit = require('../basic-info/unit/unitModel');

const PSAInfo = require('../accomplishment/public-service/publicServiceModel')
const Publisher = require('../accomplishment/publication/publisherModel')
const Publication = require('../accomplishment/publication/publicationModel');
const Training = require('../accomplishment/training-seminar/trainingSeminarModel')
const Researcher = require('../accomplishment/research-grant/researcherModel')
const Research = require('../accomplishment/research-grant/researchGrantModel')
const User = require('../../user-enrollment/userEnrollmentModel')
const Employment = require('../basic-info/employment/employmentInfoModel')
const Position = require('../basic-info/employment/employmentPositionModel')
const Education = require('../basic-info/education/educationInfoModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const reports = {};

reports.getAccomplishments = async (req, res) => {
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
            attributes: ['facultyId', 'lastName', 'firstName'],
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
                    model: PSAInfo,
                    attributes: ['position', 'organization', 'startDate', 'endDate']
                },
                {
                    model: Publisher,
                    attributes: ['publicationId'], 
                    include: {
                        model: Publication,
                        attributes: ['title', 'publicationDate']
                    }
                }, 
                {
                    model: Training,
                    attributes: ['role', 'title', 'dateFrom', 'dateTo']
                },
                {
                    model: Researcher,
                    attributes: ['researchId'],
                    include: {
                        model: Research,
                        attributes: ['researchName', 'actualStart', 'actualEnd']
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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

reports.getEmployments = async (req, res) => {
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
            attributes: ['facultyId', 'lastName', 'firstName'],
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
                    model: Employment,
                    attributes: ['employmentPositionId', 'startDate', 'endDate'],
                    where: {endDate: null},
                    include: {
                        model: Position,
                        attributes: ['position', 'employmentType']
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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

reports.getEducations = async (req, res) => {
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
            attributes: ['facultyId', 'lastName', 'firstName'],
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
                    model: Education,
                    attributes: ['educInfoId', 'degreeType', 'degreeCert', 'endDate'],
                    where: {endDate: { [Op.ne]: null } },
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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

module.exports = reports;