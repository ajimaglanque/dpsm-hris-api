// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const ResearchGrant = require('./researchGrantModel')
const Researcher = require('./researcherModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel')
const FacultyUpdate = require('../../updates/facultyUpdateModel')

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const faculty = {};

faculty.addResearchGrant = async (req, res) => {
    // logger.info('inside addResearchGrant()...');

    let jsonRes;
    
    try {
        let [rsrchgrnt, created] = await ResearchGrant.findOrCreate({
            where: { researchName: req.body.researchName },
            defaults: {
                researchName: req.body.researchName,
                granter: req.body.granter,
                amount: req.body.amount,
                projectedStart: req.body.projectedStart,
                projectedEnd: req.body.projectedEnd,
                actualStart: req.body.actualStart,
                actualEnd: req.body.projectedEnd,
                researchProgress: req.body.researchProgress,
                nonFacultyResearchers: req.body.nonFacultyResearchers
            }
        }) 

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty already has existing research grant information'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty research grant information added successfully',
                result: {
                    researchId: rsrchgrnt.researchId
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

        let [, created] = await Researcher.findOrCreate({
            where: { facultyId: req.body.facultyId, researchId: req.body.researchId },
            defaults: {
                facultyId: req.body.facultyId,
                researchId: req.body.researchId,
                proof: filename,
                status: status
            }
        })

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Could not create faculty researcher information'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.body.facultyId
            })
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

faculty.getResearchGrant = async (req, res) => {
    // logger.info('inside getResearchGrant()...');

    let jsonRes;
    let facultyList
    
    try {
        let where = { facultyId: req.params.facultyId }
        if(req.query.status) where.status = req.query.status

        facultyList = await Researcher.findAll({
            where: where,
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
                where: { researchId: research },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: 
                {
                    model: Researcher,
                    attributes: ['facultyId', 'proof', 'status', 'approverRemarks'],
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

faculty.editResearchGrant = async (req, res) => {
    // logger.info('inside editResearchGrant()...');

    let jsonRes;

    try { 
        let filename
        let updatedResearcher = true
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

        let updated = await Researcher.update(
            { 
                proof: filename,
                status: status,
                approverRemarks: approverRemarks
            }, {
                where: { facultyId: req.params.facultyId, researchId: req.body.researchId }
            }
        ) 
        
        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Faculty researcher information cannot be updated'
            };
            updatedResearcher = false
        } 
        
        if(updatedResearcher) {
            let updated = await ResearchGrant.update(
                { 
                    researchName: req.body.researchName,
                    granter: req.body.granter,
                    amount: req.body.amount,
                    projectedStart: req.body.projectedStart,
                    projectedEnd: req.body.projectedEnd,
                    actualStart: req.body.actualStart,
                    actualEnd: req.body.projectedEnd,
                    researchProgress: req.body.researchProgress,
                    nonFacultyResearchers: req.body.nonFacultyResearchers
                }, {
                    where: { researchId: req.body.researchId }
                }
            ) 
    
            if(updated == 0) {
                jsonRes = {
                    statusCode: 400,
                    success: false,
                    message: 'Faculty research grant information cannot be updated'
                };
            } else {
                FacultyUpdate.upsert({
                    facultyId: req.params.facultyId
                })
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'Faculty research grant information updated successfully'
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

faculty.editResearcherInfo = async (req, res) => {
    // logger.info('inside editPublisherInfo()...');

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

        let updated = await Researcher.update(
            { 
                proof: filename,
                status: req.body.status || "Pending",
                approverRemarks: req.body.approverRemarks
            }, {
                where: { facultyId: req.params.facultyId, researchId: req.body.researchId }
            }
        ) 
        
        if(updated == 0) {
            jsonRes = { 
                statusCode: 400,
                success: false,
                message: 'Faculty research grant information cannot be updated'
            };
        } else {
            FacultyUpdate.upsert({
                facultyId: req.params.facultyId
            })
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Faculty research grant information updated successfully'
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
                            where: { researchId: req.body.researchId }
                        }
                    )

                    if(deleted == 0) {
                        jsonRes = {
                            statusCode: 400,
                            success: false,
                            message: 'Faculty research grant information cannot be deleted'
                        };
                    } else {
                        FacultyUpdate.upsert({
                            facultyId: req.params.facultyId
                        })
                        jsonRes = {
                            statusCode: 200,
                            success: true,
                            message: 'Faculty research grant information deleted successfully'
                        }; 
                    }
                } else {
                    FacultyUpdate.upsert({
                        facultyId: req.params.facultyId
                    })
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