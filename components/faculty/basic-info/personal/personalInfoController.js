// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../../helpers/util');

const PersonalInfo = require('./personalInfoModel')
const Dependent = require('./dependentModel')
const FacultyUnit = require('../unit/facultyUnitModel');

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
        let [fclty, created] = await PersonalInfo.findOrCreate({
            where: { userId: req.body.userId },
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
                message: "Faculty added successfully",
                result: {
                    facultyId: fclty.facultyId
                }
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

faculty.updateDependent = async (req, res) => {
    // logger.info('inside addDependent()...');

    let jsonRes;
    
    try {
        let created = await Dependent.bulkCreate(req.body, 
            { 
                validate: true,
                updateOnDuplicate: ['name', 'birthDate', 'relationship']
            }
        ) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not bulk update faculty dependent information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty dependent information updated successfully'
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
        let facultyList = await PersonalInfo.findByPk(req.params.facultyId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId']
                },
                {
                    model: Dependent,
                    attributes: ['dependentId', 'name', 'birthDate', 'relationship']
                }
            ]
        });

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

faculty.editPersonalInfo = async (req, res) => {
    // logger.info('inside editPersonalInfo()...');

    let jsonRes;
    
    try {
        let updated = await PersonalInfo.update(
            { 
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                suffix: req.body.suffix,
                permanentAddress: req.body.permanentAddress,
                presentAddress: req.body.presentAddress,
                civilStatus: req.body.civilStatus,
                religion: req.body.religion,
                landline: req.body.landline,
                mobile: req.body.mobile,
                email: req.body.email,
                emergencyContactPerson: req.body.emergencyContactPerson,
                emergencyContactNumber: req.body.emergencyContactNumber,
                teachingPhilosophy: req.body.teachingPhilosophy,
                dateOfBirth: req.body.dateOfBirth,
                placeOfBirth: req.body.placeOfBirth,
                gender:req.body.gender
            }, {
                where: { facultyId: req.params.facultyId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty personal information cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Faculty personal information updated successfully"
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

faculty.deleteDependent = async (req, res) => {
    // logger.info('inside deleteDependent()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await Dependent.destroy(
           {
                where: { facultyId: req.params.facultyId, dependentId: req.body.dependentId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty dependent cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty dependent deleted successfully'
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