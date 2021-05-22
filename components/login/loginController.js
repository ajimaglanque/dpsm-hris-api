// const log4js = require('log4js');
const config = require('config');
const jwt = require('jsonwebtoken');

const util = require('../../helpers/util');

const User = require('../user-enrollment/userEnrollmentModel')
const Admin = require('../user-enrollment/adminModel')
const PersonalInfo = require('../faculty/basic-info/personal/personalInfoModel');
const FacultyUnit = require('../faculty/basic-info/unit/facultyUnitModel');
const EmploymentInfo = require('../faculty/basic-info/employment/employmentInfoModel');
const EmploymentPosition = require('../faculty/basic-info/employment/employmentPositionModel');

// const logger = log4js.getLogger('controllers - accessToken');
// logger.level = config.logLevel;

/**
 * Controller object
 */
const login = {};

login.login = async (req, res) => {
    // logger.debug('inside login()...');
    let jsonRes;

    try {
        const upemail = req.body.upemail;
        const getUser = await User.findOne({
            where: { upemail: upemail }
        })
        
        if(getUser === null) {
            jsonRes = {
                errors: [{
                    code: 401,
                    message: 'User credentials are invalid'
                }],
                statusCode: 401
            };
        } else {
            const password = req.body.password;
            let salt = getUser.salt
            const passwordHash = util.hashPassword(password, salt);

            if(passwordHash === getUser.password) {
                let userDetails = {
                    upemail: getUser.upemail,
                    role: getUser.role,
                    userId: getUser.userId,
                };
                
                if(getUser.role == 1 || getUser.role == 2 || getUser.role == 3) { 
                    let faculty = await PersonalInfo.findOne({
                        where: { userId: getUser.userId },
                        attributes: ['facultyId', 'lastName', 'firstName']
                    })
                    
                    if(faculty != null) {
                        userDetails.facultyId = faculty.facultyId
                        userDetails.name = faculty.lastName + ', ' + faculty.firstName

                        const unit = await FacultyUnit.findOne({
                            where: { facultyId: faculty.facultyId },
                            attributes: ['unitId']
                        })
                        if(unit != null) {
                            userDetails.unitId = unit.unitId
                        }

                        const employment = await EmploymentInfo.findOne({
                            where: { facultyId: faculty.facultyId, endDate: null },
                            include: {
                                model: EmploymentPosition,
                                attributes: ['position', 'employmentType']
                            }
                        })
                        
                        if(employment != null) {
                            userDetails.employmentType= employment.faculty_employment_position.employmentType
                            userDetails.position = employment.faculty_employment_position.position
                        }
                    }
                } else if(getUser.role == 5) {
                    let admin = await Admin.findOne({
                        where: { userId: getUser.userId }
                    })

                    if(admin != null) {
                        userDetails.adminId = admin.adminId
                        userDetails.name = admin.name
                    }
                }

                // generate token
                let token = jwt.sign(userDetails, process.env.TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRY
                }); 

                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: {
                        token
                    }
                };

            } else {
                jsonRes = {
                    errors: [{
                        code: 401,
                        message: 'User credentials are invalid'
                    }],
                    statusCode: 401
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

module.exports = login;