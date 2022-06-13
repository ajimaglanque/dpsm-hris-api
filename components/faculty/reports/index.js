const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const reportsController = require('./reportsController');

const router = express.Router();

/**
 * Set up logging
 */

// const logger = log4js.getLogger('routes - faculty');
// logger.level = config.logLevel;
// logger.debug('setting up /faculty route');
// console.log('routes - user-enrollment');

/**
 * Add routes
 */

router.get('/accomplishment', reportsController.getAccomplishments);
router.get('/employment', reportsController.getEmployments);
router.get('/education', reportsController.getEducations);
router.post('/accomplishment/download', reportsController.downloadAccomplishments);

module.exports = router;
