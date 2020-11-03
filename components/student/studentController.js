const log4js = require('log4js');
const config = require('config');
const util = require('../../helpers/util');

const PersonalInfo = require('./studentPersonalInfoModel')

const logger = log4js.getLogger('controllers - student');
logger.level = config.logLevel;
// console.log('controllers - student');

/**
 * Controller object
 */
const student = {};

student.addPersonalInfo = async (req, res) => {
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
                message: 'Student already exists'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Student added successfully'
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

student.getAllStudent = async (req, res) => {
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

student.getStudentPersonalInfo = async (req, res) => {
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


module.exports = student;