const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const alumniController = require('./alumniController');

const router = express.Router();

/**
 * Set up logging
 */

// const logger = log4js.getLogger('routes - alumni');
// logger.level = config.logLevel;
// logger.debug('setting up /alumni route');
// console.log('routes - alumni');


/**
 * Add routes
 */
router.post('/add/personal', alumniController.addPersonalInfo);
router.post('/add/work-exp', alumniController.addWorkExpInfo);

module.exports = router;
