// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../../helpers/util');
const { Op } = require('sequelize');

const PersonalInfo = require('../personal/personalInfoModel')
const FacultyUnit = require('./facultyUnitModel');
const Unit = require('./unitModel');
const User = require('../../../user-enrollment/userEnrollmentModel');

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addUnit = async (req, res) => {
    // logger.info('inside addEmploymentInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await FacultyUnit.findOrCreate({
            where: { facultyId: req.body.facultyId },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty is already assigned to a faculty unit'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty unit information added successfully'
            }; 
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes);    
    }
};

faculty.getUnitAssignment = async (req, res) => {
    // logger.info('inside getUnitAssignment()...');

    let jsonRes;
    
    try {
        let facultyList
        
        if(req.query.unitId) {
            let where = {}
            where.unitId = req.query.unitId

            facultyList = await Unit.findOne({
                where: where,
                attributes: ['unitId', 'unit', 'incomingUnitHead', 'approverRemarks'],
                include: {
                    model: PersonalInfo,
                    attributes: ['lastName','firstName','middleName'],
                }
            })

            if(facultyList.length === 0) {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: null,
                    message: 'Faculty not found'
                };
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: facultyList
                };    
            }
        } else {
            facultyList = await Unit.findAll({
                attributes: ['unitId', 'unit', 'incomingUnitHead', 'approverRemarks'],
                where: {
                    incomingUnitHead: { [Op.ne]: null },
                    approverRemarks: null 
                },
                include: [
                    {
                        model: PersonalInfo,
                        attributes: ['lastName','firstName','middleName'],
                        include: 
                        {
                            model: User,
                            attributes: ['userId', 'role'],                            
                        }
                    },
                    {
                        model: FacultyUnit, 
                        attributes: ['facultyId'],
                        required: false,
                        include: {
                            model: PersonalInfo,
                            attributes: ['lastName','firstName','middleName'],
                            include: 
                            {
                                model: User,
                                where: {role: '2'},
                                attributes: ['userId', 'role'],                            
                            }
                        }
                    }
                ],
                order: [
                    ['unit']
                ]
            });

            if(facultyList.length === 0) {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: null,
                    message: 'No Unit Head Assignments'
                };
            } else {
                let newList = []
                await facultyList.forEach(async (list) => {
                    await list.faculty_units.forEach(async (unit) => {
                        if(unit.faculty_personal_info != null) {
                            await newList.push({
                                unitId: list.unitId,
                                unit: list.unit,
                                incomingUnitHead: list.incomingUnitHead,
                                approverRemarks: list.approverRemarks,
                                faculty_personal_info: list.faculty_personal_info,
                                currentUnitHead: unit
                            })
                        }
                    })
                })
                
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: newList
                }; 
            }
        }

    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes);    
    }
};

faculty.editUnitAssignment = async (req, res) => {
    // logger.info('inside editUnitAssignment()...');

    let jsonRes;
    
    try {
        let updated = await Unit.update(
            { 
                incomingUnitHead: req.body.incomingUnitHead,
                approverRemarks: req.body.approverRemarks
            }, {
                where: {unitId: req.params.unitId}
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty unit information cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Faculty unit information updated successfully"
            }; 
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes);    
    }
};

module.exports = faculty;