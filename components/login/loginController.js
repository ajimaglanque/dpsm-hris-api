// const log4js = require('log4js');
const config = require('config');
const jwt = require('jsonwebtoken');

const util = require('../../helpers/util');

const User = require('../user-enrollment/userEnrollmentModel')
const Faculty = require('../faculty/basic-info/facultyPersonalInfoModel');
const PersonalInfo = require('../faculty/basic-info/facultyPersonalInfoModel');

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
                    upemail: getUser.upemail
                };
                
                // generate token
                let token = jwt.sign(userDetails, config.token.secret, {
                    expiresIn: config.token.expiry
                }); 

                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: {
                        role: getUser.role,
                        userId: getUser.userId,
                        token
                    }
                };

                if(getUser.role == 1 || getUser.role == 2 || getUser.role == 3) { 
                    let faculty = await PersonalInfo.findOne({
                        where: { userId: getUser.userId },
                        attributes: ['facultyId']
                    })
                    
                    if(faculty != null) {
                        jsonRes.result.facultyId = faculty.facultyId
                    }
                }
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