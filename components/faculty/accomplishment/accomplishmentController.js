// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../helpers/util');

const Publication = require('./facultyPublicationModel')
const Publisher = require('./facultyPublisherModel')
const TrainingSeminar = require('./facultyTrainingSeminarModel')
const LicensureExam = require('./facultyLicensureExamModel')
const ResearchGrant = require('./facultyResearchGrantModel')
const Researcher = require('./facultyResearcherModel')
const PersonalInfo = require('../basic-info/facultyPersonalInfoModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addPublication = async (req, res) => {
    // logger.info('inside addPublication()...');

    let jsonRes;
    
    try {
        let [pblctn, created] = await Publication.findOrCreate({
            where: { title: req.body.title },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing publication information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty publication information added successfully',
                result: {
                    publicationId: pblctn.publicationId
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

faculty.addPublisher = async (req, res) => {
    // logger.info('inside addPublication()...');

    let jsonRes;
    
    try {
        let created = await Publisher.bulkCreate(req.body) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not bulk create faculty publisher information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty publisher information added successfully'
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

faculty.addTrainingSeminar = async (req, res) => {
    // logger.info('inside addTrainingSeminar()...');

    let jsonRes;
    
    try {
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            [, created] = await TrainingSeminar.findOrCreate({
                where: { facultyId: req.body.facultyId, title: req.body.title, dateFrom: req.body.dateFrom },
                defaults: {
                    facultyId: req.body.facultyId,
                    role: req.body.role,
                    title: req.body.title,
                    dateFrom: req.body.dateFrom,
                    dateTo: req.body.dateTo,
                    venue: req.body.venue,
                    proof: filename,
                    status: 'For Verification'
                }
            }) 
        } else { 
            [, created] = await TrainingSeminar.findOrCreate({
                where: { facultyId: req.body.facultyId, title: req.body.title, dateFrom: req.body.dateFrom },
                defaults: {
                    facultyId: req.body.facultyId,
                    role: req.body.role,
                    title: req.body.title,
                    dateFrom: req.body.dateFrom,
                    dateTo: req.body.dateTo,
                    venue: req.body.venue,
                    status: 'Pending'
                }
            }) 
        }

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing training/seminar information'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information added successfully'
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

faculty.addLicensureExam = async (req, res) => {
    // logger.info('inside addWorkExpInfo()...');

    let jsonRes;
    
    try {
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            [, created] = await LicensureExam.findOrCreate({
                where: { facultyId: req.body.facultyId, examName: req.body.examName },
                defaults: {
                    facultyId: req.body.facultyId,
                    examName: req.body.examName,
                    examDate: req.body.examDate,
                    licenseNumber: req.body.licenseNumber,
                    proof: filename,
                    status: 'For Verification'
                }
            }) 
        } else { 
            [, created] = await LicensureExam.findOrCreate({
                where: { facultyId: req.body.facultyId, examName: req.body.examName },
                defaults: {
                    facultyId: req.body.facultyId,
                    examName: req.body.examName,
                    examDate: req.body.examDate,
                    licenseNumber: req.body.licenseNumber,
                    status: 'Pending'
                }
            }) 
        }

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing licensure exam information'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty licensure exam information added successfully'
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

faculty.addResearchGrant = async (req, res) => {
    // logger.info('inside addResearchGrant()...');

    let jsonRes;
    
    try {
        let [rsrchgrnt, created] = await ResearchGrant.findOrCreate({
            where: { researchName: req.body.researchName },
            defaults: req.body
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing research grant information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty research grant information added successfully',
                result: {
                    researchGrantId: rsrchgrnt.researchGrantId
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

faculty.addResearcher = async (req, res) => {
    // logger.info('inside addResearcher()...');

    let jsonRes;
    
    try {
        let created = await Researcher.bulkCreate(req.body) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not bulk create faculty researcher information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty researcher information added successfully'
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

faculty.getPublication = async (req, res) => {
    // logger.info('inside getPublication()...');

    let jsonRes;
    let facultyList
    
    try {
        facultyList = await Publisher.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: ['publicationId']
        });   

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty publication list empty'
            };
        } else {
            let publication = []
            await facultyList.forEach((list) => {
                publication.push(list.publicationId)
            })

            let publications = await Publication.findAll({
                where: { publicationId: publication },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: 
                {
                    model: Publisher,
                    attributes: ['facultyId', 'proof', 'status'],
                    include: 
                        {
                            model: PersonalInfo,
                            attributes: ['lastName','firstName','middleName']
                        }
                },
                order: [
                    ['publicationDate', 'DESC'],
                    [Publisher, PersonalInfo, 'lastName'],
                    [Publisher, PersonalInfo, 'firstName'],
                    [Publisher, PersonalInfo, 'middleName']
                ]
            })

            jsonRes = {
                statusCode: 200,
                success: true,
                result: publications
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

faculty.getTrainingSeminar = async (req, res) => {
    // logger.info('inside getTrainingSeminar()...');

    let jsonRes;
    
    try {
        let facultyList = await TrainingSeminar.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
            order: [['dateFrom', 'DESC']]
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

faculty.getLicensureExam = async (req, res) => {
    // logger.info('inside getLicensureExam()...');

    let jsonRes;
    
    try {
        let facultyList = await LicensureExam.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
            order: [['examDate', 'DESC']]
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

faculty.getResearchGrant = async (req, res) => {
    // logger.info('inside getResearchGrant()...');

    let jsonRes;
    let facultyList
    
    try {
        facultyList = await Researcher.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: ['researchId']
        });   

        if(facultyList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Faculty research list empty'
            };
        } else {
            let research = []
            await facultyList.forEach((list) => {
                research.push(list.researchId)
            })

            let researches = await ResearchGrant.findAll({
                where: { researchGrantId: research },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: 
                {
                    model: Researcher,
                    attributes: ['facultyId', 'proof', 'status'],
                    include: 
                        {
                            model: PersonalInfo,
                            attributes: ['lastName','firstName','middleName']
                        }
                },
                order: [
                    ['projectedStart', 'DESC'],
                    [Researcher, PersonalInfo, 'lastName'],
                    [Researcher, PersonalInfo, 'firstName'],
                    [Researcher, PersonalInfo, 'middleName']
                ]
            })

            jsonRes = {
                statusCode: 200,
                success: true,
                result: researches
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
                    model: Publication,
                    attributes: {
                        exclude: ['publicationId', 'facultyId', 'createdAt', 'updatedAt']
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
                [Publication, 'publicationDate', 'DESC'],
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

faculty.editPublisherInfo = async (req, res) => {
    // logger.info('inside editPublisherInfo()...');

    let jsonRes;

    try { 
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            let updated = await Publisher.update(
                { 
                    proof: filename,
                    status: "For Verification"
                }, {
                    where: { facultyId: req.params.facultyId, publicationId: req.body.publicationId }
                }
            ) 
            
            if(updated == 0) {
                jsonRes = {
                    statusCode: 400,
                    success: false,
                    message: 'Faculty publisher information cannot be updated'
                };
            } else {
                
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'Faculty publisher information updated successfully'
                }; 
            }
            
        } else {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty publisher information cannot be updated'
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