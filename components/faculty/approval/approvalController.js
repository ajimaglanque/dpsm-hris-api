// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize, Op } = require('sequelize');
const util = require('../../../helpers/util');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')
const User = require('../../user-enrollment/userEnrollmentModel')
const EducationInfo = require('../basic-info/education/educationInfoModel')
const PublicService = require('../accomplishment/public-service/publicServiceModel')
const Publisher = require('../accomplishment/publication/publisherModel')
const Researcher = require('../accomplishment/research-grant/researcherModel')
const TrainingSeminar = require('../accomplishment/training-seminar/trainingSeminarModel')
const LicensureExam = require('../accomplishment/licensure-exam/licensureExamModel')
const FacultyUnit = require('../basic-info/unit/facultyUnitModel');
const Unit = require('../basic-info/unit/unitModel');

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
            include: [
                {
                    model: User,
                    attributes: ['role', 'status', 'userId'],
                    where: {status: 'Active'},
                },
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    where: {facultyId: facultyId}
                }
            ]
        })

        if(!getFaculty){
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Approver does not exist'
            };
        } else { 
            let role = getFaculty.user.role
            if(role == 2 || role == 3) {
                let facultyCount = 0
                let status
                let unitIdWhere = {}
                
                if(role == 2) {
                    unitIdWhere = {
                        unitId: req.query.unitId ? req.query.unitId : getFaculty.faculty_unit.unitId
                    }
                    status = {status: 'Pending'}
                } else if(role == 3) {
                    status = {status: 'Verified'}
                }

                let faculty = await Unit.findAndCountAll({
                    where: unitIdWhere,
                    attributes: ['unitId', 'unit'],
                    include: 
                        {
                            model: FacultyUnit,
                            attributes: ['facultyId'],
                            include: 
                            {
                                model: PersonalInfo,
                                attributes: ['lastName','firstName','middleName'],
                                where: {facultyId: { [Op.ne]: facultyId } },
                                include: [
                                    { model: EducationInfo, where: status, required: false},
                                    { model: PublicService, where: status, required: false },
                                    { model: LicensureExam, where: status, required: false },
                                    { model: TrainingSeminar, where: status, required: false },
                                    { model: Publisher, where: status, required: false },
                                    { model: Researcher, where: status, required: false },
                                ]
                            },
                        },
                    order: [
                        ['unit'],
                        [FacultyUnit, PersonalInfo, 'lastName'],
                        [FacultyUnit, PersonalInfo, 'firstName'],
                        [FacultyUnit, PersonalInfo, 'middleName']
                    ]
                });
                
                let result = {}
                let newfaculty = []
                faculty.rows.forEach((units, index) => {
                    newfaculty.push({
                        unitId: units.unitId,
                        unit: units.unit,
                        faculty_units: []
                    })
                })

                faculty.rows.forEach((units, unitIndex) => { 
                    units.faculty_units.forEach((row) => {
                        if(row.faculty_personal_info.faculty_education_infos.length > 0 || row.faculty_personal_info.faculty_public_services.length > 0 || row.faculty_personal_info.faculty_licensure_exams.length > 0 || row.faculty_personal_info.faculty_training_seminars.length > 0 || row.faculty_personal_info.faculty_publishers.length > 0 || row.faculty_personal_info.faculty_researchers.length > 0) {
                            facultyCount++
                            
                            let rowCount = row.faculty_personal_info.faculty_education_infos.length + row.faculty_personal_info.faculty_public_services.length + row.faculty_personal_info.faculty_licensure_exams.length + row.faculty_personal_info.faculty_training_seminars.length + row.faculty_personal_info.faculty_publishers.length + row.faculty_personal_info.faculty_researchers.length
                            
                            let newrow = row.dataValues
                            newrow.forApprovalCount = rowCount
                            newfaculty[unitIndex].faculty_units.push(newrow)
                        }
                    })
                })

                result.facultyCount = facultyCount
                result.rows = newfaculty
                
                
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: result
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