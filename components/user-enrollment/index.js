const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const userEnrollmentController = require('./userEnrollmentController');
const authHandler = require('../../middlewares/authentication-handler');

const router = express.Router();

/**
 * Set up logging
 */

// const logger = log4js.getLogger('routes - user-enrollment');
// logger.level = config.logLevel;
// logger.debug('setting up /user-enrollment route');
// console.log('routes - user-enrollment');


/**
 * Add routes
 */
router.post('/add', userEnrollmentController.userEnroll);
router.use(authHandler.authenticateUser);
router.put('/:userId', userEnrollmentController.editUser);

module.exports = router;
