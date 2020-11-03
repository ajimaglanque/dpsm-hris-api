const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const facultyController = require('./facultyController');

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
router.post('/add/personal', facultyController.addPersonalInfo);
router.post('/add/employment', facultyController.addEmploymentInfo);
router.post('/add/education', facultyController.addEducationInfo);
router.post('/add/work-exp', facultyController.addWorkExpInfo);
router.post('/add/publication', facultyController.addPublication);
router.get('/', facultyController.getAllFaculty);
router.get('/:facultyId', facultyController.getFacultyPersonalInfo);
router.get('/:facultyId/work-exp', facultyController.getWorkExpInfo);

module.exports = router;
