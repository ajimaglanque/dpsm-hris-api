// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../helpers/util');

const PublicService = require('./facultyPublicServiceModel')
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

faculty.addPublicService = async (req, res) => {
    // logger.info('inside addPublicService()...');

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

            [, created] = await PublicService.findOrCreate({
                where: { facultyId: req.body.facultyId, type: req.body.type, position: req.body.position, startDate: req.body.startDate },
                defaults: {
                    facultyId: req.body.facultyId,
                    type: req.body.type,
                    position: req.body.position,
                    organization: req.body.organization,
                    description: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    proof: filename,
                    status: 'For Verification'
                }
            }) 
        } else { 
            [, created] = await PublicService.findOrCreate({
                where: { facultyId: req.body.facultyId, type: req.body.type, position: req.body.position, startDate: req.body.startDate },
                defaults: {
                    facultyId: req.body.facultyId,
                    type: req.body.type,
                    position: req.body.position,
                    organization: req.body.organization,
                    description: req.body.description,
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
                message: 'Faculty already has existing public service information'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information added successfully'
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
                    remarks: req.body.remarks,
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
                    remarks: req.body.remarks,
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
                    rank: req.body.rank,
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
                    rank: req.body.rank,
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

faculty.getPublicService = async (req, res) => {
    // logger.info('inside getPublicService()...');

    let jsonRes;
    
    try {
        let facultyList = await PublicService.findAll({
            where: { facultyId: req.params.facultyId },
            attributes: { exclude: ['facultyId', 'createdAt', 'updatedAt'] },
            order: [
                ['type', 'DESC'],
                ['startDate', 'DESC']
            ]
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
            attributes: { exclude: ['createdAt', 'updatedAt'] },
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

faculty.editPublicServiceInfo = async (req, res) => {
    // logger.info('inside editPublicServiceInfo()...');

    let jsonRes;

    try { 
        if(req.files && req.files.proof && req.body.endDate) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            updated = await PublicService.update(
                { 
                    type: req.body.type,
                    position: req.body.position,
                    organization: req.body.organization,
                    description: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    proof: filename,
                    status: 'For Verification'
                }, {
                    where: { facultyId: req.params.facultyId, publicServiceId: req.body.publicServiceId }
                }
            ) 
            
            
        } else {
            updated = await PublicService.update(
                { 
                    type: req.body.type,
                    position: req.body.position,
                    organization: req.body.organization,
                    description: req.body.description,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                }, {
                    where: { facultyId: req.params.facultyId, publicServiceId: req.body.publicServiceId }
                }
            ) 
        }

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty public service information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information updated successfully'
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

faculty.editPublicationInfo = async (req, res) => {
    // logger.info('inside editPublicationInfo()...');

    let jsonRes;

    try { 
        let updatedPublisher = true
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
                updatedPublisher = false
            } 
        } 
        
        if(updatedPublisher) {
            let updated = await Publication.update(
                { 
                    title: req.body.title,
                    journal: req.body.journal,
                    url: req.body.url,
                    publicationDate: req.body.publicationDate,
                    nonFacultyAuthors: req.body.nonFacultyAuthors
                }, {
                    where: { publicationId: req.body.publicationId }
                }
            ) 
    
            if(updated == 0) {
                jsonRes = {
                    statusCode: 400,
                    success: false,
                    message: 'Faculty publication information cannot be updated'
                };
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'Faculty publication information updated successfully'
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

faculty.editTrainingSeminarInfo = async (req, res) => {
    // logger.info('inside editTrainingSeminarInfo()...');

    let jsonRes;

    try { 
        if(req.files && req.files.proof && req.body.endDate) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            updated = await TrainingSeminar.update(
                { 
                    title: req.body.title,
                    role: req.body.role,
                    dateFrom: req.body.dateFrom,
                    dateTo: req.body.dateTo,
                    venue: req.body.venue,
                    remarks: req.body.remarks,
                    proof: filename,
                    status: 'For Verification'
                }, {
                    where: { facultyId: req.params.facultyId, tsId: req.body.tsId }
                }
            ) 
            
            
        } else {
            updated = await TrainingSeminar.update(
                { 
                    title: req.body.title,
                    role: req.body.role,
                    dateFrom: req.body.dateFrom,
                    dateTo: req.body.dateTo,
                    venue: req.body.venue,
                    remarks: req.body.remarks
                }, {
                    where: { facultyId: req.params.facultyId, tsId: req.body.tsId }
                }
            ) 
        }

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty training/seminar information cannot be updated'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information updated successfully'
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

faculty.deletePublicService = async (req, res) => {
    // logger.info('inside deletePublicService()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await PublicService.destroy(
            {
                where: { facultyId: req.params.facultyId, publicServiceId: req.body.publicServiceId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty public service information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty public service information deleted successfully'
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

faculty.deletePublisher = async (req, res) => {
    // logger.info('inside deletePublisher()...');

    let jsonRes;
    let deleted

    try { 
        let deletedPublication = true

        deleted = await Publisher.destroy(
            {
                where: { facultyId: req.params.facultyId, publicationId: req.body.publicationId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty publisher information cannot be deleted'
            };
        } else {
            await Publisher.count({ 
                where: { publicationId: req.body.publicationId } 
            }).then(async (count) => {
                if(count == 0) {
                    let deleted = await Publication.destroy(
                        {
                            where: { publicationId: req.body.publicationId }
                        }
                    )

                    if(deleted == 0) {
                        jsonRes = {
                            statusCode: 400,
                            success: false,
                            message: 'Faculty publication information cannot be deleted'
                        };

                        deletedPublication = false
                    } 
                }

                if(deletedPublication) {
                    jsonRes = {
                        statusCode: 200,
                        success: true,
                        message: 'Faculty publication information deleted successfully'
                    }; 
                }
            })
            
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

faculty.deleteTrainingSeminar = async (req, res) => {
    // logger.info('inside deleteTrainingSeminar()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await TrainingSeminar.destroy(
            {
                where: { facultyId: req.params.facultyId, tsId: req.body.tsId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty training/seminar information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty training/seminar information deleted successfully'
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

faculty.deleteLicensureExam = async (req, res) => {
    // logger.info('inside deleteLicensureExam()...');

    let jsonRes;
    let deleted

    try { 
        
        deleted = await LicensureExam.destroy(
            {
                where: { facultyId: req.params.facultyId, licenseId: req.body.licenseId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty licensure exam information cannot be deleted'
            };
        } else {
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty licensure exam information deleted successfully'
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

faculty.deleteResearcher = async (req, res) => {
    // logger.info('inside deleteResearcher()...');

    let jsonRes;
    let deleted

    try { 
        deleted = await Researcher.destroy(
            {
                where: { facultyId: req.params.facultyId, researchId: req.body.researchId }
            }
        ) 

        if(deleted == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty researcher information cannot be deleted'
            };
        } else {
            await Researcher.count({ 
                where: { researchId: req.body.researchId } 
            }).then(async (count) => {
                if(count == 0) {
                    let deleted = await ResearchGrant.destroy(
                        {
                            where: { researchGrantId: req.body.researchId }
                        }
                    )

                    if(deleted == 0) {
                        jsonRes = {
                            statusCode: 400,
                            success: false,
                            message: 'Faculty research grant information cannot be deleted'
                        };
                    } else {
                        jsonRes = {
                            statusCode: 200,
                            success: true,
                            message: 'Faculty research grant information deleted successfully'
                        }; 
                    }
                } else {
                    jsonRes = {
                        statusCode: 200,
                        success: true,
                        message: 'Faculty researcher information deleted successfully'
                    };
                }
            })
            
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