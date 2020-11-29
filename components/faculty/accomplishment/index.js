const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const accomplishmentController = require('./accomplishmentController');

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
router.post('/add/publication', accomplishmentController.addPublication);
router.post('/add/publisher', accomplishmentController.addPublisher);
router.post('/add/training-seminar', accomplishmentController.addTrainingSeminar);
router.post('/add/licensure-exam', accomplishmentController.addLicensureExam);
router.get('/:facultyId/publication', accomplishmentController.getPublication);
router.get('/:facultyId/training-seminar', accomplishmentController.getTrainingSeminar);
router.put('/edit/:facultyId/publisher', accomplishmentController.editPublisherInfo);

module.exports = router;
