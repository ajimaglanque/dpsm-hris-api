// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const Publication = require('./publicationModel')
const Publisher = require('./publisherModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel')

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
                    status: "Pending"
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

module.exports = faculty;