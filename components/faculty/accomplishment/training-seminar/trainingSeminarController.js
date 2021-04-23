// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const TrainingSeminar = require('./trainingSeminarModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addTrainingSeminar = async (req, res) => {
    // logger.info('inside addTrainingSeminar()...');

    let jsonRes;
    
    try {
        let filename
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

        } 

        [, created] = await TrainingSeminar.findOrCreate({
            where: { facultyId: req.body.facultyId, title: req.body.title, dateFrom: req.body.dateFrom },
            defaults: {
                facultyId: req.body.facultyId,
                role: req.body.role,
                title: req.body.title,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                venue: req.body.venue,
                remarks: req.body.remarks,
                proof: filename,
                status: 'Pending'
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing training/seminar information'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information added successfully'
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

faculty.getTrainingSeminar = async (req, res) => {
    // logger.info('inside getTrainingSeminar()...');

    let jsonRes;
    
    try {
        let facultyList = await TrainingSeminar.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['dateFrom', 'DESC']]
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

faculty.editTrainingSeminarInfo = async (req, res) => {
    // logger.info('inside editTrainingSeminarInfo()...');

    let jsonRes;

    try { 
        let filename

        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

        } 

        updated = await TrainingSeminar.update(
            { 
                title: req.body.title,
                role: req.body.role,
                dateFrom: req.body.dateFrom,
                dateTo: req.body.dateTo,
                venue: req.body.venue,
                remarks: req.body.remarks,
                proof: filename,
                status: 'Pending'
            }, {
                where: { facultyId: req.params.facultyId, tsId: req.body.tsId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty training/seminar information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information updated successfully'
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

faculty.deleteTrainingSeminar = async (req, res) => {
    // logger.info('inside deleteTrainingSeminar()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await TrainingSeminar.destroy(
            {
                where: { facultyId: req.params.facultyId, tsId: req.body.tsId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty training/seminar information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information deleted successfully'
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