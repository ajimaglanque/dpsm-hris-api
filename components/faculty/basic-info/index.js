const express = require('express');
// const log4js = require('log4js');
// const config = require('config')

const basicInfoController = require('./basicInfoController');
const personalInfoController = require('./personal/personalInfoController');
const workExpInfoController = require('./work-exp/workExpInfoController');
const educationInfoController = require('./education/educationInfoController');
const employmentInfoController = require('./employment/employmentInfoController');
const unitController = require('./unit/unitController');

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

router.post('/add/personal', personalInfoController.addPersonalInfo);
router.get('/:facultyId', personalInfoController.getFacultyPersonalInfo);
router.put('/:facultyId/personal', personalInfoController.editPersonalInfo);
router.put('/dependent', personalInfoController.updateDependent);
router.delete('/:facultyId/dependent', personalInfoController.deleteDependent);

router.post('/add/work-exp', workExpInfoController.addWorkExpInfo);
router.get('/:facultyId/work-exp', workExpInfoController.getWorkExpInfo);
router.put('/:facultyId/work-exp', workExpInfoController.editWorkExpInfo);
router.delete('/:facultyId/work-exp', workExpInfoController.deleteWorkExpInfo);

router.post('/add/education', educationInfoController.addEducationInfo);
router.get('/:facultyId/education', educationInfoController.getEducationInfo);
router.put('/:facultyId/education', educationInfoController.editEducationInfo);
router.delete('/:facultyId/education', educationInfoController.deleteEducationInfo);

router.post('/add/employment', employmentInfoController.addEmploymentInfo);
router.get('/:facultyId/employment', employmentInfoController.getEmploymentInfo);
router.get('/employment/positions', employmentInfoController.getEmploymentPositions);

router.post('/add/unit', unitController.addUnit);
router.get('/unit/assignment', unitController.getUnitAssignment);
router.put('/unit/:unitId', unitController.editUnitAssignment);
router.delete('/unit/:unitId', unitController.deleteUnitAssignment);

router.get('/list/all', basicInfoController.getAllFacultyInfo);
router.get('/', basicInfoController.getAllFaculty);

module.exports = router;
