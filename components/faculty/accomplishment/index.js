const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const publicServiceController = require('./public-service/publicServiceController')
const licensureExamController = require('./licensure-exam/licensureExamController')
const trainingSeminarController = require('./training-seminar/trainingSeminarController')
const publicationController = require('./publication/publicationController')
const researchGrantController = require('./research-grant/researchGrantController');

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
router.post('/add/public-service', publicServiceController.addPublicService);
router.get('/:facultyId/public-service', publicServiceController.getPublicService);
router.put('/:facultyId/public-service', publicServiceController.editPublicServiceInfo);
router.delete('/:facultyId/public-service', publicServiceController.deletePublicService);

router.post('/add/licensure-exam', licensureExamController.addLicensureExam);
router.get('/:facultyId/licensure-exam', licensureExamController.getLicensureExam);
router.put('/:facultyId/licensure-exam', licensureExamController.editLicensureExamInfo);
router.delete('/:facultyId/licensure-exam', licensureExamController.deleteLicensureExam);

router.post('/add/training-seminar', trainingSeminarController.addTrainingSeminar);
router.get('/:facultyId/training-seminar', trainingSeminarController.getTrainingSeminar);
router.put('/:facultyId/training-seminar', trainingSeminarController.editTrainingSeminarInfo);
router.delete('/:facultyId/training-seminar', trainingSeminarController.deleteTrainingSeminar);

router.post('/add/publication', publicationController.addPublication);
router.post('/add/publisher', publicationController.addPublisher);
router.get('/:facultyId/publication', publicationController.getPublication);
router.put('/:facultyId/publication', publicationController.editPublicationInfo);
router.put('/:facultyId/publisher', publicationController.editPublisherInfo);
router.delete('/:facultyId/publisher', publicationController.deletePublisher);

router.post('/add/research-grant', researchGrantController.addResearchGrant);
router.post('/add/researcher', researchGrantController.addResearcher);
router.get('/:facultyId/research-grant', researchGrantController.getResearchGrant);
router.put('/:facultyId/research-grant', researchGrantController.editResearchGrant);
router.put('/:facultyId/researcher', researchGrantController.editResearcherInfo);
router.delete('/:facultyId/researcher', researchGrantController.deleteResearcher);

module.exports = router;
