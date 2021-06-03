// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../../helpers/util');

const PersonalInfo = require('../personal/personalInfoModel')
const FacultyUnit = require('./facultyUnitModel');
const FacultyUnitAssignment = require('./facultyUnitAssignmentModel');

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addUnit = async (req, res) => {
    // logger.info('inside addEmploymentInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await FacultyUnit.findOrCreate({
            where: { facultyId: req.body.facultyId },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty is already assigned to a faculty unit'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty unit information added successfully'
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

faculty.editUnitAssignment = async (req, res) => {
    // logger.info('inside editUnitAssignment()...');

    let jsonRes;
    
    try {
        let updated = await FacultyUnitAssignment.upsert(
            { 
                unitId: req.params.unitId,
                incomingUnitHead: req.body.incomingUnitHead,
                approverRemarks: req.body.approverRemarks
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty unit information cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Faculty unit information updated successfully"
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

faculty.deleteUnitAssignment = async (req, res) => {
    // logger.info('inside deleteUnitAssignment()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await FacultyUnitAssignment.destroy(
           {
                where: { unitId: req.params.unitId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty unit assignment cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty unit assignment deleted successfully'
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