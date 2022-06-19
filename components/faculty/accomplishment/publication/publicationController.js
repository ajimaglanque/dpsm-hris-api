// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const Publication = require('./publicationModel')
const Publisher = require('./publisherModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel')
const FacultyUpdate = require('../../updates/facultyUpdateModel')
const FacultyUnit = require('../../basic-info/unit/facultyUnitModel');
const Unit = require('../../basic-info/unit/unitModel');

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
        let user = res.locals.user
        let status
        switch(user.role) {
            case 1: status = 'Pending'; break;
            case 2: status = 'Verified'; break;
            case 3: status = 'Approved'; break;
        }

        let filename

        if(req.files?.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);
        } 

        
        let [pblctn, created] = await Publication.findOrCreate({
            where: { title: req.body.title },
            defaults: {
                title: req.body.title,
                citation: req.body.citation,
                url: req.body.url,
                publicationDate: req.body.publicationDate,
                nonFacultyAuthors: req.body.nonFacultyAuthors,
                proof: filename,
                status: status
            }
        }) 

        if(!created) { 
            if((user.role == 2 && (pblctn.status == 'Pending')) || (user.role == 3 && (pblctn.status == 'Pending' || pblctn.status == 'Verified'))) {
                await Publication.update(
                    { 
                        citation: req.body.citation,
                        url: req.body.url,
                        publicationDate: req.body.publicationDate,
                        nonFacultyAuthors: req.body.nonFacultyAuthors,
                        proof: filename,
                        status: status 
                    }, 
                    {
                        where: { publicationId: pblctn.publicationId }
                    }
                );
            }
            await FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
            let existing = await Publisher.findAll({
                where: { facultyId: req.body.facultyId },
                attributes: ['publicationId'],
                include: {
                    model: Publication,
                    where: { title: req.body.title },
                    required: true,
                    attributes: ['publicationId']
                }
            })
            
            if(existing.length > 0) { 
                jsonRes = {
                    statusCode: 400,
                    success: false,
                    message: 'Faculty already has existing publication information'
                };
            } else { 
                let dpsmAuthors
                if(req.body.dpsmAuthors) { 
                    dpsmAuthors = JSON.parse(req.body.dpsmAuthors)
                    dpsmAuthors.forEach(async (e) => { 
                        let [pub, created] = await Publisher.findOrCreate({
                            where: { facultyId: e, publicationId: pblctn.publicationId },
                            defaults: {
                                facultyId: e,
                                publicationId: pblctn.publicationId
                            }
                        }) 
                    })
                }
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'Faculty publication information added successfully',
                    result: {
                        publicationId: pblctn.publicationId
                    }
                }; 
            }
        } else { 
            let dpsmAuthors
            if(req.body.dpsmAuthors) {
                dpsmAuthors = JSON.parse(req.body.dpsmAuthors)
                
                dpsmAuthors.forEach(async (e) => { 
                    let created = await Publisher.create({
                        facultyId: e,
                        publicationId: pblctn.publicationId
                    }) 
                })
            }
            await FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
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
        let filename

        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

        } 

        let status = 'Pending'
        if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';

        let [publisher, created] = await Publisher.findOrCreate({
            where: { facultyId: req.body.facultyId, publicationId: req.body.publicationId },
            defaults: {
                facultyId: req.body.facultyId,
                publicationId: req.body.publicationId,
                proof: filename,
                status: status
            }
        }) 

        if(!publisher) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not find or create faculty publisher information'
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

            let where = {publicationId: publication}
            if(req.query.status) where.status = req.query.status

            let publications = await Publication.findAll({
                where: where,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: 
                {
                    model: Publisher,
                    attributes: ['facultyId'],
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
        let filename
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

        } 

        let status = 'Pending'
        let approverRemarks = req.body.approverRemarks
        if(req.body.status) {
            status = req.body.status
            if(status != 'Rejected') approverRemarks = null
        } else if(res.locals.user.role == 2) status = 'Verified'
        else if(res.locals.user.role == 3) status = 'Approved';
        
        let updated = await Publication.update(
            { 
                title: req.body.title,
                citation: req.body.citation,
                url: req.body.url,
                publicationDate: req.body.publicationDate,
                nonFacultyAuthors: req.body.nonFacultyAuthors,
                proof: filename,
                status: status,
                approverRemarks: approverRemarks
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
            FacultyUpdate.upsert({
                facultyId: req.params.facultyId
            })
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty publication information updated successfully'
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
                    FacultyUpdate.upsert({
                        facultyId: req.params.facultyId
                    })
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