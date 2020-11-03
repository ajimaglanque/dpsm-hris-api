const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const studentController = require('./studentController');

const router = express.Router();

/**
 * Set up logging
 */

// const logger = log4js.getLogger('routes - student');
// logger.level = config.logLevel;
// logger.debug('setting up /student route');
// console.log('routes - student');


/**
 * Add routes
 */
router.post('/add/personal', studentController.addPersonalInfo);

module.exports = router;
