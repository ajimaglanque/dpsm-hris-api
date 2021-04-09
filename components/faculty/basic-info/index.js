const express = require('express');
// const log4js = require('log4js');
// const config = require('config')
const multer = require('multer')
var upload = multer({ dest: './../../../uploads/' })

const basicInfoController = require('./basicInfoController');

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

router.post('/add/personal', basicInfoController.addPersonalInfo);
router.post('/add/unit', basicInfoController.addUnit);
router.post('/add/employment', basicInfoController.addEmploymentInfo);
router.post('/add/education', basicInfoController.addEducationInfo);
router.post('/add/work-exp', basicInfoController.addWorkExpInfo);
router.get('/all', basicInfoController.getAllFacultyInfo);
router.get('/', basicInfoController.getAllFaculty);
router.get('/:facultyId', basicInfoController.getFacultyPersonalInfo);
router.get('/:facultyId/employment', basicInfoController.getEmploymentInfo);
router.get('/:facultyId/education', basicInfoController.getEducationInfo);
router.get('/:facultyId/work-exp', basicInfoController.getWorkExpInfo);
router.put('/:facultyId/personal', basicInfoController.editPersonalInfo);
router.put('/dependent', basicInfoController.updateDependent);
router.put('/:facultyId/education', basicInfoController.editEducationInfo);
router.put('/:facultyId/work-exp', basicInfoController.editWorkExpInfo);
router.delete('/:facultyId/dependent', basicInfoController.deleteDependent);
router.delete('/:facultyId/education', basicInfoController.deleteEducationInfo);
router.delete('/:facultyId/work-exp', basicInfoController.deleteWorkExpInfo);

module.exports = router;
