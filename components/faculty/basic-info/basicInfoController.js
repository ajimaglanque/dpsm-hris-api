// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../helpers/util');

const PersonalInfo = require('./facultyPersonalInfoModel')
const Dependent = require('./facultyDependentModel')
const FacultyUnit = require('./facultyUnitModel');
const EducationInfo = require('./facultyEducationInfoModel')
const EmploymentInfo = require('./facultyEmploymentInfoModel')
const WorkExpInfo = require('./facultyWorkExpInfoModel')
const Unit = require('./unitModel');
const EmploymentPosition = require('./facultyEmploymentPositionModel');

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addPersonalInfo = async (req, res) => {
    // logger.info('inside addPersonalInfo()...');

    let jsonRes;
    
    try {
        let [fclty, created] = await PersonalInfo.findOrCreate({
            where: { userId: req.body.userId },
            defaults: req.body
        })

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already exists'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Faculty added successfully",
                result: {
                    facultyId: fclty.facultyId
                }
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

faculty.updateDependent = async (req, res) => {
    // logger.info('inside addDependent()...');

    let jsonRes;
    
    try {
        let created = await Dependent.bulkCreate(req.body, 
            { 
                validate: true,
                updateOnDuplicate: ['name', 'birthDate', 'relationship']
            }
        ) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not bulk update faculty dependent information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty dependent information updated successfully'
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

faculty.addEmploymentInfo = async (req, res) => {
    // logger.info('inside addEmploymentInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await EmploymentInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, position: req.body.position },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing employment information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty employment information added successfully'
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

faculty.addEducationInfo = async (req, res) => {
    // logger.info('inside addEducationInfo()...');

    let jsonRes;
    let created

    try { 
        if(req.files && req.files.proof && req.body.endDate) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            [, created] = await EducationInfo.findOrCreate({
                where: { facultyId: req.body.facultyId, degreeType: req.body.degreeType, degreeCert: req.body.degreeCert },
                defaults: {
                    facultyId: req.body.facultyId,
                    institutionSchool: req.body.institutionSchool,
                    degreeType: req.body.degreeType,
                    degreeCert: req.body.degreeCert,
                    majorSpecialization: req.body.majorSpecialization,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    proof: filename,
                    status: 'For Verification'
                }
            }) 
            
            
        } else { 
            [, created] = await EducationInfo.findOrCreate({
                where: { facultyId: req.body.facultyId, degreeType: req.body.degreeType, degreeCert: req.body.degreeCert },
                defaults: {
                    facultyId: req.body.facultyId,
                    institutionSchool: req.body.institutionSchool,
                    degreeType: req.body.degreeType,
                    degreeCert: req.body.degreeCert,
                    majorSpecialization: req.body.majorSpecialization,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    status: 'Pending'
                }
            }) 
        }

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing education information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information added successfully'
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

faculty.addWorkExpInfo = async (req, res) => {
    // logger.info('inside addWorkExpInfo()...');

    let jsonRes;
    
    try {
        let [, created] = await WorkExpInfo.findOrCreate({
            where: { facultyId: req.body.facultyId, employerName: req.body.employerName },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing work experience information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information added successfully'
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

faculty.getAllFaculty = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList = await Unit.findAll({
            attributes: ['unitId', 'unit'],
            include: 
                {
                    model: FacultyUnit,
                    attributes: ['facultyId'],
                    include: 
                        {
                            model: PersonalInfo,
                            attributes: ['lastName','firstName','middleName']
                        }
                },
            order: [
                ['unit'],
                [FacultyUnit, PersonalInfo, 'lastName'],
                [FacultyUnit, PersonalInfo, 'firstName'],
                [FacultyUnit, PersonalInfo, 'middleName']
            ]
        });   

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
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

faculty.getFacultyPersonalInfo = async (req, res) => {
    // logger.info('inside getFacultyPersonalInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await PersonalInfo.findByPk(req.params.facultyId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: 
                {
                    model: Dependent,
                    attributes: ['dependentId', 'name', 'birthDate', 'relationship']
                }
        });

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

faculty.getEmploymentInfo = async (req, res) => {
    // logger.info('inside getEmploymentInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await EmploymentInfo.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: ['employmentInfoId', 'startDate', 'endDate'],
            include: 
                {
                    model: EmploymentPosition,
                    attributes: ['employmentType', 'position'],
                },
            order: [['startDate', 'DESC']]
        });
        

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty employment info empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
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

faculty.getEducationInfo = async (req, res) => {
    // logger.info('inside getEductionInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await EducationInfo.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId'] },
            order: [['startDate', 'DESC']]
        });

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty employment info empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
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

faculty.getWorkExpInfo = async (req, res) => {
    // logger.info('inside getWorkExpInfo()...');

    let jsonRes;
    
    try {
        let facultyList = await WorkExpInfo.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
            order: [['endDate', 'DESC']]
        });

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty work experience info empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
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

faculty.getAllFacultyInfo = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList = await PersonalInfo.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    }
                },
                {
                    model: EmploymentInfo,
                    attributes: {
                        exclude: ['employmentInfoId', 'facultyId', 'createdAt', 'updatedAt']
                    },
                    
                },
                {
                    model: EducationInfo,
                    attributes: {
                        exclude: ['educInfoId', 'facultyId', 'createdAt', 'updatedAt']
                    }
                },
                {
                    model: WorkExpInfo,
                    attributes: {
                        exclude: ['workExpId', 'facultyId', 'createdAt', 'updatedAt']
                    }
                }
            ],
            order: [
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
                [EmploymentInfo, 'startDate', 'DESC'],
                [EducationInfo, 'startDate', 'DESC'],
                [WorkExpInfo, 'endDate', 'DESC'],
            ]
          });

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty list empty'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: facultyList
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

faculty.editPersonalInfo = async (req, res) => {
    // logger.info('inside editPersonalInfo()...');

    let jsonRes;
    
    try {
        let updated = await PersonalInfo.update(
            { 
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                suffix: req.body.suffix,
                permanentAddress: req.body.permanentAddress,
                presentAddress: req.body.presentAddress,
                civilStatus: req.body.civilStatus,
                religion: req.body.religion,
                landline: req.body.landline,
                mobile: req.body.mobile,
                email: req.body.email,
                emergencyContactPerson: req.body.emergencyContactPerson,
                emergencyContactNumber: req.body.emergencyContactNumber
            }, {
                where: { facultyId: req.params.facultyId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty personal information cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Faculty personal information updated successfully"
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

faculty.editEducationInfo = async (req, res) => {
    // logger.info('inside editEducationInfo()...');

    let jsonRes;
    let updated

    try { 
        if(req.files && req.files.proof && req.body.endDate) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            updated = await EducationInfo.update(
                { 
                    institutionSchool: req.body.institutionSchool,
                    degreeType: req.body.degreeType,
                    degreeCert: req.body.degreeCert,
                    majorSpecialization: req.body.majorSpecialization,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    proof: filename,
                    status: 'For Verification'
                }, {
                    where: { facultyId: req.params.facultyId, educInfoId: req.body.educInfoId }
                }
            ) 
            
            
        } else {
            updated = await EducationInfo.update(
                { 
                    institutionSchool: req.body.institutionSchool,
                    degreeType: req.body.degreeType,
                    degreeCert: req.body.degreeCert,
                    majorSpecialization: req.body.majorSpecialization,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                }, {
                    where: { facultyId: req.params.facultyId, educInfoId: req.body.educInfoId }
                }
            ) 
        }

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty education information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information updated successfully'
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

faculty.editWorkExpInfo = async (req, res) => {
    // logger.info('inside editWorkExpInfo()...');

    let jsonRes;
    let updated

    try { 
        
        updated = await WorkExpInfo.update(
            { 
                employerName: req.body.employerName,
                position: req.body.position,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }, {
                where: { facultyId: req.params.facultyId, workExpId: req.body.workExpId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty work experience information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information updated successfully'
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

faculty.deleteDependent = async (req, res) => {
    // logger.info('inside deleteDependent()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await Dependent.destroy(
           {
                where: { facultyId: req.params.facultyId, dependentId: req.body.dependentId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty dependent cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty dependent deleted successfully'
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

faculty.deleteEducationInfo = async (req, res) => {
    // logger.info('inside deleteEducationInfo()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await EducationInfo.destroy(
           {
                where: { facultyId: req.params.facultyId, educInfoId: req.body.educInfoId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty education information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty education information deleted successfully'
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

faculty.deleteWorkExpInfo = async (req, res) => {
    // logger.info('inside deleteWorkExpInfo()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await WorkExpInfo.destroy(
           {
                where: { facultyId: req.params.facultyId, workExpId: req.body.workExpId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty work experience information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty work experience information deleted successfully'
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