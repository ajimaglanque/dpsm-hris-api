// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const LicensureExam = require('./licensureExamModel')
const FacultyUpdate = require('../../updates/facultyUpdateModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel');
const FacultyUnit = require('../../basic-info/unit/facultyUnitModel');
const Unit = require('../../basic-info/unit/unitModel');

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addLicensureExam = async (req, res) => {
    // logger.info('inside addWorkExpInfo()...');

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

        let status = 'Pending'
        if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';

        [, created] = await LicensureExam.findOrCreate({
            where: { facultyId: req.body.facultyId, examName: req.body.examName },
            defaults: {
                facultyId: req.body.facultyId,
                examName: req.body.examName,
                examDate: req.body.examDate,
                licenseNumber: req.body.licenseNumber,
                rank: req.body.rank,
                proof: filename,
                status: status
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing licensure exam information'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty licensure exam information added successfully'
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

faculty.getLicensureExam = async (req, res) => {
    // logger.info('inside getLicensureExam()...');

    let jsonRes;
    
    try {
        let where = {
            facultyId: req.params.facultyId 
        }
        if(req.query.status) where.status = req.query.status

        let facultyList = await LicensureExam.findAll({
            where: where,
            attributes: { exclude: ['facultyId', 'createdAt'] },
            order: [['examDate', 'DESC']]
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

faculty.editLicensureExamInfo = async (req, res) => {
    // logger.info('inside editLicensureExamInfo()...');
    
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

        let status = 'Pending'
        let approverRemarks = req.body.approverRemarks
        if(req.body.status) {
            status = req.body.status
            if(status != 'Rejected') approverRemarks = null
        } else if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';

        const rowToUpdate = await LicensureExam.findOne({
            where: { 
                facultyId: req.params.facultyId, 
                licenseId: req.body.licenseId
            }
        })
        //Set previous file name as current file name before update
        const previousFileName = rowToUpdate ? rowToUpdate.proof : null

        updated = await LicensureExam.update(
            { 
                examName: req.body.examName,
                examDate: req.body.examDate,
                licenseNumber: req.body.licenseNumber,
                rank: req.body.rank || null,
                proof: filename,
                status: status,
                approverRemarks: approverRemarks
            }, {
                where: { facultyId: req.params.facultyId, licenseId: req.body.licenseId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty licensure exam information cannot be updated'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.params.facultyId
            })

            if(filename){
                util.deleteFile(previousFileName)
            }

            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty licensure exam information updated successfully'
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

faculty.deleteLicensureExam = async (req, res) => {
    // logger.info('inside deleteLicensureExam()...');

    let jsonRes;
    let deleted

    try { 
        const rowToUpdate = await LicensureExam.findOne({
            where: { 
                facultyId: req.params.facultyId, 
                licenseId: req.body.licenseId
            }
        })
        //Set previous file name as current file name before update
        const previousFileName = rowToUpdate ? rowToUpdate.proof : null

        deleted = await LicensureExam.destroy(
            {
                where: { facultyId: req.params.facultyId, licenseId: req.body.licenseId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty licensure exam information cannot be deleted'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.params.facultyId
            })
            
            if(previousFileName){
                util.deleteFile(previousFileName)
            }
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty licensure exam information deleted successfully'
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