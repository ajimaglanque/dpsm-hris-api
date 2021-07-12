// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const PersonalInfo = require('../personal/personalInfoModel')
const FacultyUnit = require('../unit/facultyUnitModel');
const EmploymentInfo = require('./employmentInfoModel')
const Unit = require('../unit/unitModel');
const EmploymentPosition = require('./employmentPositionModel');

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addEmploymentInfo = async (req, res) => {
    // logger.info('inside addEmploymentInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await EmploymentInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, employmentPositionId: req.body.employmentPositionId },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing employment information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty employment information added successfully'
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

faculty.getEmploymentInfo = async (req, res) => {
    // logger.info('inside getEmploymentInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await PersonalInfo.findByPk(req.params.facultyId, {
            attributes: ['facultyId'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    }
                },
                {
                    model: EmploymentInfo,
                    attributes: ['employmentInfoId', 'status', 'category', 'startDate', 'endDate'],
                    include: {
                        model: EmploymentPosition,
                        attributes: ['employmentPositionId', 'position']
                    }
                }
            ],
            order: [[EmploymentInfo, 'startDate', 'DESC']]
        });
        

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty employment info empty'
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

faculty.getEmploymentPositions = async (req, res) => {
    // logger.info('inside getEmploymentPositions()...');

    let jsonRes;
    
    try {
        let positionsList = await EmploymentPosition.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        

        if(positionsList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty positions list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: positionsList
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

faculty.editEmploymentInfo = async (req, res) => {
    // logger.info('inside editEmployment()...');

    let jsonRes;
    let updated

    try { 
        
        updated = await EmploymentInfo.update(
            { 
                employmentPositionId: req.body.employmentPositionId,
                status: req.body.status,
                category: req.body.category,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }, {
                where: { facultyId: req.params.facultyId, employmentInfoId: req.body.employmentInfoId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty employment information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty employment information updated successfully'
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

faculty.deleteEmploymentInfo = async (req, res) => {
    // logger.info('inside deleteEmployment()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await EmploymentInfo.destroy(
           {
                where: { facultyId: req.params.facultyId, employmentInfoId: req.body.employmentInfoId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty employment information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty employment information deleted successfully'
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