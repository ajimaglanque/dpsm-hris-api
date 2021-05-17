const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const basicInfo = require('./basic-info');
const accomplishments = require('./accomplishment');
const facultyLoad = require('./faculty-load');
const evaluations = require('./evaluation');
const approval = require('./approval');

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
router.use('/basic-info', basicInfo);
router.use('/accomplishment', accomplishments);
router.use('/load', facultyLoad);
router.use('/evaluation', evaluations);
router.use('/approval', approval);

module.exports = router;
