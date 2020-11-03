const log4js = require('log4js');
const config = require('config');
const util = require('../../helpers/util');

const PersonalInfo = require('./alumniPersonalInfoModel')
const WorkExpInfo = require('./alumniWorkExpInfoModel')

const logger = log4js.getLogger('controllers - alumni');
logger.level = config.logLevel;
// console.log('controllers - alumni');

/**
 * Controller object
 */
const alumni = {};

alumni.addPersonalInfo = async (req, res) => {
    logger.info('inside addPersonalInfo()...');
    logger.debug('request body to add personal info -');

    let jsonRes;
    
    try {
        let [, created] = await PersonalInfo.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Alumni already exists'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Alumni added successfully'
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

alumni.addWorkExpInfo = async (req, res) => {
    logger.info('inside addWorkExpInfo()...');
    logger.debug('request body to add work exp info -');

    let jsonRes;
    
    try {
        let [, created] = await WorkExpInfo.findOrCreate({
            where: { alumniId: req.body.alumniId, employerName: req.body.employerName },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Alumni already has existing work experience information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Alumni work experience information added successfully'
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

alumni.getAllStudent = async (req, res) => {
    logger.info('inside getAllStudent()...');
    logger.debug('request body to get all student -');

    let jsonRes;
    
    try {
        let studentList = await EmploymentInfo.findAll({
            attributes: ['position', 'startDate', 'endDate', 'salary'],
            include: [
                {
                    model: PersonalInfo,
                    attributes: ['studentId', 'lastName', 'firstName', 'middleName']
                },
                {
                    model: Unit,
                    attributes: ['unit']
                }
            ],
            order: [
                [{model: Unit}, 'unit'],
                [{model: PersonalInfo}, 'lastName'],
                [{model: PersonalInfo}, 'firstName'],
                [{model: PersonalInfo}, 'middleName']
            ]
          });

        if(studentList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Saculty list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: studentList
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

alumni.getStudentPersonalInfo = async (req, res) => {
    logger.info('inside getStudentPersonalInfo()...');
    logger.debug('request body to get student personal info -');

    let jsonRes;
    
    try {
        let studentList = await PersonalInfo.findByPk(req.params.studentId);

        if(studentList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty not found'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: studentList
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

module.exports = alumni;