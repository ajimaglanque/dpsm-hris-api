// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const PublicService = require('./publicServiceModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addPublicService = async (req, res) => {
    // logger.info('inside addPublicService()...');

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
        [, created] = await PublicService.findOrCreate({
            where: { facultyId: req.body.facultyId, type: req.body.type, position: req.body.position, startDate: req.body.startDate },
            defaults: {
                facultyId: req.body.facultyId,
                type: req.body.type,
                position: req.body.position,
                organization: req.body.organization,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                proof: filename,
                status: 'Pending'
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing public service information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information added successfully'
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

faculty.getPublicService = async (req, res) => {
    // logger.info('inside getPublicService()...');

    let jsonRes;
    
    try {
        let facultyList = await PublicService.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
            order: [
                ['type', 'DESC'],
                ['startDate', 'DESC']
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

faculty.editPublicServiceInfo = async (req, res) => {
    // logger.info('inside editPublicServiceInfo()...');

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

        updated = await PublicService.update(
            { 
                type: req.body.type,
                position: req.body.position,
                organization: req.body.organization,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                proof: filename,
                status: 'Pending'
            }, {
                where: { facultyId: req.params.facultyId, publicServiceId: req.body.publicServiceId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty public service information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information updated successfully'
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

faculty.deletePublicService = async (req, res) => {
    // logger.info('inside deletePublicService()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await PublicService.destroy(
            {
                where: { facultyId: req.params.facultyId, publicServiceId: req.body.publicServiceId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty public service information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information deleted successfully'
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