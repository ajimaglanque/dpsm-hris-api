// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../../helpers/util');

const WorkExpInfo = require('./workExpInfoModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

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

faculty.getWorkExpInfo = async (req, res) => {
    // logger.info('inside getWorkExpInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await WorkExpInfo.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
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

faculty.editWorkExpInfo = async (req, res) => {
    // logger.info('inside editWorkExpInfo()...');

    let jsonRes;
    let updated

    try { 
        
        updated = await WorkExpInfo.update(
            { 
                employerName: req.body.employerName,
                position: req.body.position,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }, {
                where: { facultyId: req.params.facultyId, workExpId: req.body.workExpId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty work experience information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information updated successfully'
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

faculty.deleteWorkExpInfo = async (req, res) => {
    // logger.info('inside deleteWorkExpInfo()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await WorkExpInfo.destroy(
           {
                where: { facultyId: req.params.facultyId, workExpId: req.body.workExpId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty work experience information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information deleted successfully'
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