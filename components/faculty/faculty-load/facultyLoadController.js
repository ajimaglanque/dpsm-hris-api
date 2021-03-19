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
        let classRecord = req.files.classRecord
        let name = classRecord.name
        let fileExtension = mime.extension(classRecord.mimetype);

        let filename = util.createRandomString(name.length)
        filename += '.' + fileExtension
        
        let path = 'uploads/' + filename
        classRecord.mv(path);

        let [, created] = await FacultyLoad.findOrCreate({
            where: { facultyId: req.body.facultyId, academicYear: req.body.academicYear, subject: req.body.subject, section: req.body.section },
            defaults: {
                facultyId: req.body.facultyId,
                academicYear: req.body.academicYear,
                subject: req.body.subject, 
                section: req.body.section,
                classRecord: filename
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

module.exports = faculty;