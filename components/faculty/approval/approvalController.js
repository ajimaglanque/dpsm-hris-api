// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../helpers/util');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')
const User = require('../../user-enrollment/userEnrollmentModel')
const Role = require('../../user-enrollment/roleModel')
const EducationInfo = require('../basic-info/education/educationInfoModel')
const PublicService = require('../accomplishment/public-service/publicServiceModel')
const Publisher = require('../accomplishment/publication/publisherModel')
const Researcher = require('../accomplishment/research-grant/researcherModel')
const TrainingSeminar = require('../accomplishment/training-seminar/trainingSeminarModel')
const LicensureExam = require('../accomplishment/licensure-exam/licensureExamModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const approval = {};

approval.getFacultyList = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyId = req.params.facultyId
        let getFaculty = await PersonalInfo.findByPk(facultyId, {
            attributes: ['userId'],
            include: {
                model: User,
                attributes: ['role']
            }
        })

        if(!getFaculty){
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Approver does not exist'
            };
        } else { 
            // get count
            let role = getFaculty.user.role
            if(role == 2 || role == 3) {
                let facultyCount = 0
                let approvalCount = 0
                let rows = []
                let status
                
                if(role == 2) {
                    status = {status: 'Pending'}
                } else if(role == 3) {
                    status = {status: 'Verified'}
                }
                
                let faculty = await PersonalInfo.findAndCountAll({
                    // where: {facultyId: facultyId},
                    attributes: ['facultyId', 'lastName', 'firstName'],
                    include: [
                        { model: EducationInfo, where: status, required: false},
                        { model: PublicService, where: status, required: false },
                        { model: LicensureExam, where: status, required: false },
                        { model: TrainingSeminar, where: status, required: false },
                        { model: Publisher, where: status, required: false },
                        { model: Researcher, where: status, required: false },
                    ]
                })
                
                
                faculty.rows.forEach((row) => {
                    if(row.faculty_education_infos.length > 0 || row.faculty_public_services.length > 0 || row.faculty_licensure_exams.length > 0 || row.faculty_training_seminars.length > 0 || row.faculty_publishers.length > 0 || row.faculty_researchers.length > 0) {
                        facultyCount++
                        let rowCount = row.faculty_education_infos.length + row.faculty_public_services.length + row.faculty_licensure_exams.length + row.faculty_training_seminars.length + row.faculty_publishers.length + row.faculty_researchers.length
                        approvalCount += rowCount
                        let newrow = row.dataValues
                        newrow.count = rowCount
                        rows.push(newrow)
                    }
                })

                faculty.count = facultyCount
                faculty.approvalCount = approvalCount
                faculty.rows = rows
                
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: faculty
                }; 
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: null,
                    message: 'Approver does not exist'
                };
            }
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

module.exports = approval;