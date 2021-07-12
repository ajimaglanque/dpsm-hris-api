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
        let psaDateWhere = {}
        let pubDateWhere = {}
        let tsDateWhere = {}
        let rgDateWhere = {}

        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }
        if(req.query.startDate) {
            psaDateWhere.startDate = { [Op.gte]: req.query.startDate } 
            tsDateWhere.dateFrom = { [Op.gte]: req.query.startDate } 
            rgDateWhere.actualStart = { [Op.gte]: req.query.startDate } 
            if(req.query.endDate) {
                pubDateWhere.publicationDate = { [Op.between]: [req.query.startDate, req.query.endDate] } 
            } else {
                pubDateWhere.publicationDate = { [Op.gte]: req.query.startDate } 
            }
        }

        if(req.query.endDate) {
            psaDateWhere.endDate = { [Op.lte]: req.query.endDate } 
            tsDateWhere.dateTo = { [Op.lte]: req.query.endDate } 
            rgDateWhere.actualEnd = { [Op.lte]: req.query.endDate } 
            if(req.query.startDate) {
                pubDateWhere.publicationDate = { [Op.between]: [req.query.startDate, req.query.endDate] } 
            } else pubDateWhere.publicationDate = { [Op.lte]: req.query.endDate } 
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
                    attributes: ['position', 'organization', 'startDate', 'endDate'],
                    required: false,
                    where: psaDateWhere
                },
                {
                    model: Publisher,
                    attributes: ['publicationId'], 
                    required: false,
                    include: {
                        model: Publication,
                        attributes: ['title', 'publicationDate'],
                        where: pubDateWhere
                    }
                }, 
                {
                    model: Training,
                    attributes: ['role', 'title', 'dateFrom', 'dateTo'],
                    required: false,
                    where: tsDateWhere
                },
                {
                    model: Researcher,
                    attributes: ['researchId'],
                    required: false,
                    include: {
                        model: Research,
                        attributes: ['researchName', 'actualStart', 'actualEnd'],
                        where: rgDateWhere
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

        let filter = []
        filter.push({
            endDate: { [Op.eq]: null }
        });
        if(req.query.startDate) {
            if(req.query.endDate) {
                filter.push({
                    startDate: { [Op.between]: [req.query.startDate, req.query.endDate] }
                })
            } else {
                filter.push({
                    startDate: { [Op.gte]: req.query.startDate }
                })
            }
        }
        let empWhere = {
            [Op.and]: [ filter ]
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
                    attributes: ['employmentPositionId', 'status', 'category', 'startDate', 'endDate'],
                    where: empWhere,
                    include: {
                        model: Position,
                        attributes: ['position']
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

        let filter = []
        filter.push({
            endDate: { [Op.ne]: null }
        });
        if(req.query.startDate) filter.push({
            endDate: { [Op.gte]: req.query.startDate }
        })
        if(req.query.endDate) filter.push({
            endDate: { [Op.lte]: req.query.endDate }
        })
        let educWhere = {
            [Op.and]: [ filter ]
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
                    where: educWhere
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