// const log4js = require('log4js');
// const config = require('config');
const util = require('../../helpers/util');

const User = require('./userEnrollmentModel')
const Admin = require('./adminModel')
const PersonalInfo = require('../faculty/basic-info/personal/personalInfoModel')

// const logger = log4js.getLogger('controllers - userEnrollment');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const userEnrollment = {};

userEnrollment.userEnroll = async (req, res) => {
    // logger.info('inside userEnroll()...');
    // console.log('inside userEnroll()...');

    let jsonRes;

    const salt = util.getSalt();
    const passwordHash = util.hashPassword(req.body.password, salt);
    
    try {
        let [usr, created] = await User.findOrCreate({
            where: { upemail: req.body.upemail },
            defaults: {
                role: req.body.role,
                status: req.body.status || 'Inactive',
                upemail: req.body.upemail,
                password: passwordHash,
                salt: salt
            }
        })

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'UP Email already exists'
            };
        } else {
            // check if role id is (1,2,3) -> Create faculty personal information
            if(['1','2','3'].indexOf(req.body.role) != -1 && req.body.personalInfo) {
                try {
                    let [fclty, created] = await PersonalInfo.findOrCreate({
                        where: { userId: usr.userId },
                        defaults: {
                            userId: usr.userId,
                            lastName: req.body.personalInfo.lastName,
                            firstName: req.body.personalInfo.firstName,
                            middleName: req.body.personalInfo.middleName,
                            dateOfBirth: req.body.personalInfo.dateOfBirth,
                            placeOfBirth: req.body.personalInfo.placeOfBirth,
                            gender: req.body.personalInfo.gender,
                            permanentAddress: req.body.personalInfo.permanentAddress,
                            presentAddress: req.body.personalInfo.presentAddress,
                            mobile: req.body.personalInfo.mobile,
                            landline: req.body.personalInfo.landline,
                            email: req.body.personalInfo.email,
                            civilStatus: req.body.personalInfo.civilStatus,
                            religion: req.body.personalInfo.religion,
                            emergencyContactPerson: req.body.personalInfo.emergencyContactPerson,
                            emergencyContactNumber: req.body.personalInfo.emergencyContactNumber
                        }
                    })
                    if(!created) {
                        jsonRes = {
                            statusCode: 400,
                            success: false,
                            message: 'Faculty already exists'
                        };
                    } else {
                        jsonRes = {
                            statusCode: 200,
                            success: true,
                            message: "Faculty added successfully",
                            result: {
                                facultyId: fclty.facultyId
                            }
                        }; 
                    }
                } catch(error) {
                    jsonRes = {
                        statusCode: 500,
                        success: false,
                        error: error,
                    };
                }
            } else if(req.body.role == 5) { // if admin staff
                try {
                    let [adminInfo, created] = await Admin.findOrCreate({
                        where: { userId: usr.userId },
                        defaults: {
                            userId: usr.userId,
                            name: req.body.name
                        }
                    })
                    if(!created) {
                        jsonRes = {
                            statusCode: 400,
                            success: false,
                            message: 'Admin already exists'
                        };
                    } else {
                        jsonRes = {
                            statusCode: 200,
                            success: true,
                            message: "Admin added successfully",
                            result: {
                                adminId: adminInfo.adminId
                            }
                        }; 
                    }
                } catch(error) {
                    jsonRes = {
                        statusCode: 500,
                        success: false,
                        error: error,
                    };
                }
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'User enrolled successfully'
                }; 
            }
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    }
    util.sendResponse(res, jsonRes);    
};

module.exports = userEnrollment;