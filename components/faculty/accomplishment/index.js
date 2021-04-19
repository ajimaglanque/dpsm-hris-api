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
router.post('/add/public-service', accomplishmentController.addPublicService);
router.post('/add/publication', accomplishmentController.addPublication);
router.post('/add/publisher', accomplishmentController.addPublisher);
router.post('/add/training-seminar', accomplishmentController.addTrainingSeminar);
router.post('/add/licensure-exam', accomplishmentController.addLicensureExam);
router.post('/add/research-grant', accomplishmentController.addResearchGrant);
router.post('/add/researcher', accomplishmentController.addResearcher);
router.get('/:facultyId/public-service', accomplishmentController.getPublicService);
router.get('/:facultyId/publication', accomplishmentController.getPublication);
router.get('/:facultyId/training-seminar', accomplishmentController.getTrainingSeminar);
router.get('/:facultyId/licensure-exam', accomplishmentController.getLicensureExam);
router.get('/:facultyId/research-grant', accomplishmentController.getResearchGrant);
router.put('/:facultyId/public-service', accomplishmentController.editPublicServiceInfo);
router.put('/:facultyId/publication', accomplishmentController.editPublicationInfo);
router.put('/:facultyId/training-seminar', accomplishmentController.editTrainingSeminarInfo);
router.delete('/:facultyId/public-service', accomplishmentController.deletePublicService);
router.delete('/:facultyId/publisher', accomplishmentController.deletePublisher);
router.delete('/:facultyId/training-seminar', accomplishmentController.deleteTrainingSeminar);
router.delete('/:facultyId/licensure-exam', accomplishmentController.deleteLicensureExam);
router.delete('/:facultyId/researcher', accomplishmentController.deleteResearcher);

module.exports = router;
