// const log4js = require('log4js');
// const config = require('config');
const mime = require('mime-types')
const { Sequelize } = require('sequelize');
const util = require('../../../../helpers/util');

const ResearchGrant = require('./researchGrantModel')
const Researcher = require('./researcherModel')
const PersonalInfo = require('../../basic-info/personal/personalInfoModel')

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

faculty.editResearchGrant = async (req, res) => {
    // logger.info('inside editResearchGrant()...');

    let jsonRes;

    try { 
        let updatedResearcher = true
        if(req.files && req.files.proof) {
            let proof = req.files.proof
            let name = proof.name
            let fileExtension = mime.extension(proof.mimetype);
    
            let filename = util.createRandomString(name.length)
            filename += '.' + fileExtension
            
            let path = 'uploads/' + filename
            proof.mv(path);

            let updated = await Researcher.update(
                { 
                    proof: filename,
                    status: "Pending"
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
                    where: { researchGrantId: req.body.researchId }
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