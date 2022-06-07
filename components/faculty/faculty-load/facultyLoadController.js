// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../helpers/util');

const FacultyLoad = require('./facultyLoadModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addFacultyLoad = async (req, res) => {
    // logger.info('inside addFacultyLoad()...');

    let jsonRes;
    
    try {
        let setFile

        if(req.files && req.files.setResults) {
            let setResults = req.files.setResults
            let name = setResults.name
            let fileExtension = mime.extension(setResults.mimetype);
    
            setFile = util.createRandomString(name.length)
            setFile += '.' + fileExtension
            
            let path = 'uploads/' + setFile
            setResults.mv(path);
        } 

        let [, created] = await FacultyLoad.findOrCreate({
            where: { facultyId: req.body.facultyId, academicYear: req.body.academicYear, subject: req.body.subject, section: req.body.section },
            defaults: {
                facultyId: req.body.facultyId,
                academicYear: req.body.academicYear,
                semester: req.body.semester, 
                subject: req.body.subject, 
                section: req.body.section,
                setResults: setFile
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing class record'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty class record added successfully'
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

faculty.getFacultyLoad = async (req, res) => {
    // logger.info('inside getEductionInfo()...');

    let jsonRes;
  
    try {
        let where = {
            facultyId: req.params.facultyId 
        }

        let facultyList = await FacultyLoad.findAll({
            where: where,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['academicYear', 'DESC'], ['semester', 'ASC'], ['subject', 'ASC']]
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

faculty.editFacultyLoad = async (req, res) => {
    // logger.info('inside editFacultyLoad()...');

    let jsonRes;
    let updated

    try { 
        let syllabusFile
        if(req.files && req.files.syllabus) {
            let syllabus = req.files.syllabus
            let name = syllabus.name
            let fileExtension = mime.extension(syllabus.mimetype);
    
            syllabusFile = util.createRandomString(name.length)
            syllabusFile += '.' + fileExtension
            
            let path = 'uploads/' + syllabusFile
            syllabus.mv(path); 
        }

        updated = await FacultyLoad.update(
            { 
                subject: req.body.subject, 
                section: req.body.section,
                semester: req.body.semester,
                academicYear: req.body.academicYear,
                syllabus: syllabusFile
            }, {
                where: { facultyId: req.params.facultyId, recordId: req.body.recordId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty load information cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty load information updated successfully'
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

faculty.deleteFacultyLoad = async (req, res) => {
    // logger.info('inside deleteFacultyLoad()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await FacultyLoad.destroy(
           {
                where: { facultyId: req.params.facultyId, recordId: req.body.recordId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty load information cannot be deleted'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty load information deleted successfully'
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