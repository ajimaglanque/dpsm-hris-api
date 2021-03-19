const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const evaluationController = require('./evaluationController');

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

router.post('/', evaluationController.addPeerEvaluation);
// router.get('/:facultyId', evaluationController.getFacultyEvaluations);

module.exports = router;
