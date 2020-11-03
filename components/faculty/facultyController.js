// const log4js = require('log4js');
const config = require('config');
const util = require('../../helpers/util');

const PersonalInfo = require('./facultyPersonalInfoModel')
const EducationInfo = require('./facultyEducationInfoModel')
const EmploymentInfo = require('./facultyEmploymentInfoModel')
const WorkExpInfo = require('./facultyWorkExpInfoModel')
const Publication = require('./facultyPublicationModel')
const Unit = require('./facultyUnitModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addPersonalInfo = async (req, res) => {
    // logger.info('inside addPersonalInfo()...');

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
                message: 'Faculty already exists'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty added successfully'
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

faculty.addEducationInfo = async (req, res) => {
    // logger.info('inside addEducationInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await EducationInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, degreeCert: req.body.degreeCert, majorSpecialization: req.body.majorSpecialization },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing education information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information added successfully'
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

faculty.addEmploymentInfo = async (req, res) => {
    // logger.info('inside addEmploymentInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await EmploymentInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, position: req.body.position },
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

faculty.addWorkExpInfo = async (req, res) => {
    // logger.info('inside addWorkExpInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await WorkExpInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, employerName: req.body.employerName },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing work experience information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information added successfully'
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

faculty.addPublication = async (req, res) => {
    // logger.info('inside addPublication()...');

    let jsonRes;
    
    try {
        let [, created] = await Publication.findOrCreate({
            where: { facultyId: req.body.facultyId, publication: req.body.publication },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing publication information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty publication information added successfully'
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

faculty.getAllFaculty = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList = await EmploymentInfo.findAll({
            attributes: ['position', 'startDate', 'endDate', 'salary'],
            include: [
                {
                    model: PersonalInfo,
                    attributes: ['facultyId', 'lastName', 'firstName', 'middleName']
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

faculty.getFacultyPersonalInfo = async (req, res) => {
    // logger.info('inside getFacultyPersonalInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await PersonalInfo.findByPk(req.params.facultyId);

        if(facultyList.length === 0) {
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

faculty.getWorkExpInfo = async (req, res) => {
    // logger.info('inside getWorkExpInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await WorkExpInfo.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: ['employerName', 'startDate', 'endDate', 'position', 'salary', 'contactNumber', 'supervisor', 'reasonsForLeaving'],
            order: [['endDate', 'DESC']]
        });

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty work experience info empty'
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