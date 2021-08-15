// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const util = require('../../../../helpers/util');

const EducationInfo = require('./educationInfoModel')
const FacultyUpdate = require('../../updates/facultyUpdateModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addEducationInfo = async (req, res) => {
    // logger.info('inside addEducationInfo()...');

    let jsonRes;
    let created

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

        let status = 'Pending'
        if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';
        
        [, created] = await EducationInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, degreeType: req.body.degreeType, degreeCert: req.body.degreeCert },
            defaults: {
                facultyId: req.body.facultyId,
                institutionSchool: req.body.institutionSchool,
                degreeType: req.body.degreeType,
                degreeCert: req.body.degreeCert,
                majorSpecialization: req.body.majorSpecialization,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                proof: filename,
                status: status
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing education information'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })

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

faculty.getEducationInfo = async (req, res) => {
    // logger.info('inside getEductionInfo()...');

    let jsonRes;
  
    try {
        let where = {
            facultyId: req.params.facultyId 
        }
        if(req.query.status) where.status = req.query.status

        let facultyList = await EducationInfo.findAll({
            where: where,
            attributes: { exclude: ['facultyId'] },
            order: [['startDate', 'DESC']]
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

faculty.editEducationInfo = async (req, res) => {
    // logger.info('inside editEducationInfo()...');

    let jsonRes;
    let updated

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

        let status = 'Pending'
        let approverRemarks = req.body.approverRemarks
        if(req.body.status) {
            status = req.body.status
            if(status != 'Rejected') approverRemarks = null
        } else if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';

        updated = await EducationInfo.update(
            { 
                institutionSchool: req.body.institutionSchool,
                degreeType: req.body.degreeType,
                degreeCert: req.body.degreeCert,
                majorSpecialization: req.body.majorSpecialization,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                proof: filename,
                status: status,
                approverRemarks: approverRemarks
            }, {
                where: { facultyId: req.params.facultyId, educInfoId: req.body.educInfoId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty education information cannot be updated'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.params.facultyId,
            })

            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information updated successfully'
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

faculty.deleteEducationInfo = async (req, res) => {
    // logger.info('inside deleteEducationInfo()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await EducationInfo.destroy(
           {
                where: { facultyId: req.params.facultyId, educInfoId: req.body.educInfoId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty education information cannot be deleted'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information deleted successfully'
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