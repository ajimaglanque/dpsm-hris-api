// const log4js = require('log4js');
// const config = require('config');
const util = require('../../../helpers/util');
const { Op } = require('sequelize');

const PersonalInfo = require('../basic-info/personal/personalInfoModel')
const FacultyUnit = require('../basic-info/unit/facultyUnitModel');
const Unit = require('../basic-info/unit/unitModel');

const PSAInfo = require('../accomplishment/public-service/publicServiceModel')
const Publisher = require('../accomplishment/publication/publisherModel')
const Publication = require('../accomplishment/publication/publicationModel');
const Training = require('../accomplishment/training-seminar/trainingSeminarModel')
const Researcher = require('../accomplishment/research-grant/researcherModel')
const Research = require('../accomplishment/research-grant/researchGrantModel')
const Licensure = require('../accomplishment/licensure-exam/licensureExamModel')
const User = require('../../user-enrollment/userEnrollmentModel')
const Employment = require('../basic-info/employment/employmentInfoModel')
const Position = require('../basic-info/employment/employmentPositionModel')
const Education = require('../basic-info/education/educationInfoModel')

const psController = require('../accomplishment/public-service/publicServiceController')

let XLSX = require("xlsx")

// const logger = log4js.getLogger('controllers - faculty');
// logger.level = config.logLevel;
// console.log('controllers - userEnrollment');

/**
 * Controller object
 */
const reports = {};

reports.getAccomplishments = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 
        let unitIdWhere = {}
        let psaDateWhere = { status: 'Approved' }
        let pubDateWhere = { status: 'Approved' }
        let tsDateWhere = { status: 'Approved' }
        let licExamDateWhere = { status: 'Approved' }
        let rgDateWhere = { status: 'Approved' }

        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }
        if(req.query.startDate) {
            psaDateWhere.startDate = { [Op.gte]: req.query.startDate } 
            tsDateWhere.dateFrom = { [Op.gte]: req.query.startDate } 
            licExamDateWhere.examDate = { [Op.gte]: req.query.startDate } 
            rgDateWhere.actualStart = { [Op.gte]: req.query.startDate } 
            if(req.query.endDate) {
                licExamDateWhere.examDate = { [Op.between]: [req.query.startDate, req.query.endDate] }
                pubDateWhere.publicationDate = { [Op.between]: [req.query.startDate, req.query.endDate] } 
            } else {
                pubDateWhere.publicationDate = { [Op.gte]: req.query.startDate } 
            }
        }

        if(req.query.endDate) {
            psaDateWhere.endDate = { [Op.lte]: req.query.endDate } 
            tsDateWhere.dateTo = { [Op.lte]: req.query.endDate } 
            licExamDateWhere.examDate = { [Op.lte]: req.query.endDate } 
            rgDateWhere.actualEnd = { [Op.lte]: req.query.endDate } 
            if(req.query.startDate) {
                licExamDateWhere.examDate = { [Op.between]: [req.query.startDate, req.query.endDate] }
                pubDateWhere.publicationDate = { [Op.between]: [req.query.startDate, req.query.endDate] } 
            } else pubDateWhere.publicationDate = { [Op.lte]: req.query.endDate } 
        }
        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: unitIdWhere
                },
                {
                    model: PSAInfo,
                    attributes: ['position', 'organization', 'startDate', 'endDate', 'status'],
                    required: false,
                    where: psaDateWhere
                },
                {
                    model: Publisher,
                    attributes: ['publicationId'], 
                    required: false,
                    include: {
                        model: Publication,
                        attributes: ['title', 'publicationDate', 'status'],
                        where: pubDateWhere
                    }
                }, 
                {
                    model: Training,
                    attributes: ['role', 'title', 'dateFrom', 'dateTo', 'status'],
                    required: false,
                    where: tsDateWhere
                },
                {
                    model: Licensure,
                    attributes: ['examName', 'examDate', 'licenseNumber', 'rank', 'status'],
                    required: false,
                    where: licExamDateWhere
                },
                {
                    model: Researcher,
                    attributes: ['researchId'],
                    required: false,
                    include: {
                        model: Research,
                        attributes: ['researchName', 'actualStart', 'actualEnd', 'status'],
                        where: rgDateWhere
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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
//NEW VERSIONS
reports.getFacultyAccomplishments = async (req, res) => {
    let jsonRes;
    
    try {
        let facultyList 
        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where:  req.query.unitId && { unitId: req.query.unitId }
                },
                {
                    model: PSAInfo,
                    attributes: ['position', 'organization', 'startDate', 'endDate', 'status'],
                    required: false,
                    where: {
                        [Op.and] : [
                            { 
                                status: 'Approved' 
                            },
                            req.query.startDate && { startDate: { [Op.gte]: new Date(req.query.startDate) } },
                            req.query.endDate && { endDate: { [Op.lte]: new Date(req.query.endDate) } }
                        ]
                    }
                },
                {
                    model: Publisher,
                    attributes: ['publicationId'], 
                    required: false,
                    include: {
                        model: Publication,
                        attributes: ['title', 'publicationDate', 'status'],
                        where: {
                            [Op.and] : [
                                { 
                                    status: 'Approved' 
                                },
                                {  
                                    //  Used lte & gte operation to check condition even with only 1 provided date.
                                    [Op.and] : [
                                        req.query.startDate && { publicationDate: { [Op.gte]: new Date(req.query.startDate) } },
                                        req.query.endDate && { publicationDate: { [Op.lte]: new Date(req.query.endDate) } }
                                    ]
                                },
                            ]
                        }
                    }
                }, 
                {
                    model: Training,
                    attributes: ['role', 'title', 'dateFrom', 'dateTo', 'status'],
                    required: false,
                    where: {
                        [Op.and] : [
                            { 
                                status: 'Approved' 
                            },
                            req.query.startDate && { dateFrom: { [Op.gte]: new Date(req.query.startDate) } },
                            req.query.endDate && { dateTo: { [Op.lte]: new Date(req.query.endDate) } }
                        ]
                    }
                },
                {
                    model: Licensure,
                    attributes: ['examName', 'examDate', 'licenseNumber', 'rank', 'status'],
                    required: false,
                    where: {
                        [Op.and] : [
                            { 
                                status: 'Approved' 
                            },
                            {  
                                //  Used lte & gte operation to check condition even with only 1 provided date.
                                [Op.and] : [
                                    req.query.startDate && { examDate: { [Op.gte]: new Date(req.query.startDate) } },
                                    req.query.endDate && { examDate: { [Op.lte]: new Date(req.query.endDate) } }
                                ]
                            },
                        ]
                    }
                },
                {
                    model: Researcher,
                    attributes: ['researchId'],
                    required: false,
                    include: {
                        model: Research,
                        attributes: ['researchName', 'actualStart', 'actualEnd', 'status'],
                        where: {
                            [Op.and] : [
                                { 
                                    status: 'Approved' 
                                },
                                req.query.startDate && { actualStart: { [Op.gte]: new Date(req.query.startDate) } },
                                req.query.endDate && { actualEnd: { [Op.lte]: new Date(req.query.endDate) } }
                            ]
                        }
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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
                result: facultyList,
               
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
reports.getFacultyEmployments = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 

        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: req.query.unitId && { unitId: req.query.unitId }
                },
                {
                    model: Employment,
                    attributes: ['employmentPositionId', 'status', 'category', 'startDate', 'endDate'],
                    where: {
                        [Op.and] : [
                            req.query.startDate && { startDate: { [Op.gte]: new Date(req.query.startDate) } },
                            req.query.endDate && { endDate: { [Op.lte]: new Date(req.query.endDate) } }
                        ]
                    },
                    include: {
                        model: Position,
                        attributes: ['position']
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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
reports.getFacultyEducations = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 
        
        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: req.query.unitId && { unitId: req.query.unitId }
                },
                {
                    model: Education,
                    attributes: ['educInfoId', 'degreeType', 'degreeCert', 'endDate', 'status'],
                    where: {
                        [Op.and] : [
                            { 
                                status: 'Approved' 
                            },
                            req.query.startDate && { startDate: { [Op.gte]: new Date(req.query.startDate) } },
                            req.query.endDate && { endDate: { [Op.lte]: new Date(req.query.endDate) } }
                        ]
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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
// END

reports.getEmployments = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 
        let unitIdWhere = {}
        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }

        let filter = []
        filter.push({
            endDate: { [Op.eq]: null }
        });
        if(req.query.startDate) {
            if(req.query.endDate) {
                filter.push({
                    startDate: { [Op.between]: [req.query.startDate, req.query.endDate] }
                })
            } else {
                filter.push({
                    startDate: { [Op.gte]: req.query.startDate }
                })
            }
        }
        let empWhere = {
            [Op.and]: [ filter ]
        } 

        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: unitIdWhere
                },
                {
                    model: Employment,
                    attributes: ['employmentPositionId', 'status', 'category', 'startDate', 'endDate'],
                    where: empWhere,
                    include: {
                        model: Position,
                        attributes: ['position']
                    }
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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

reports.getEducations = async (req, res) => {
    // logger.info('inside getFaculty()...');

    let jsonRes;
    
    try {
        let facultyList 
        let unitIdWhere = {}
        if(req.query.unitId) {
            unitIdWhere = {
                unitId: req.query.unitId
            }
        }

        let filter = []
        filter.push({
            endDate: { [Op.ne]: null }
        });
        if(req.query.startDate) filter.push({
            endDate: { [Op.gte]: req.query.startDate }
        })
        if(req.query.endDate) filter.push({
            endDate: { [Op.lte]: req.query.endDate }
        })
        let educWhere = {
            [Op.and]: [ {status: 'Approved'}, filter ]
        } 
        
        facultyList = await PersonalInfo.findAll({
            attributes: ['facultyId', 'lastName', 'firstName'],
            include: [
                {
                    model: FacultyUnit,
                    attributes: ['unitId'],
                    include: {
                        model: Unit,
                        attributes: ['unit']
                    },
                    where: unitIdWhere
                },
                {
                    model: Education,
                    attributes: ['educInfoId', 'degreeType', 'degreeCert', 'endDate', 'status'],
                    where: educWhere
                },
            ],
            order: [
                [FacultyUnit, Unit, 'unit'],
                ['lastName', 'ASC'],
                ['firstName','ASC'],
                ['middleName', 'ASC'],
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

reports.downloadAccomplishments = async (req, res) => {
    let body = req.body

    let psContent = []
    let pubContent = []
    let tsContent = []
    let rgContent = []
    let leContent = []
    let educContent = []

    let where = req.query.unitId ? { unitId: req.query.unitId } : {}

    if(body.includes('publicService')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: PSAInfo,
                        attributes: { exclude: ['publicServiceId', 'facultyId', 'proof', 'approverRemarks', 'createdAt', 'updatedAt'] },
                        required: true,
                        where: { status: 'Approved' }
                    },
                    order: [
                        [Unit, 'unit', 'ASC']
                        [Unit, PersonalInfo, 'lastName', 'ASC'],
                        [Unit, PersonalInfo, PSAInfo, 'type', 'ASC']
                        [Unit, PersonalInfo, PSAInfo, 'startDate', 'DESC']
                    ]
                }
            ]
        })
        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_public_services.forEach((j) => {
                    psContent.push({
                        Unit: i.unit.unit,
                        Name: `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        Type: j.type,
                        Position: j.position,
                        Organization: j.organization,
                        Description: j.description,
                        StartDate: j.startDate,
                        EndDate: j.endDate
                    })
                })
            })
        }
    }

    if(body.includes('publication')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: Publisher,
                        required: true,
                        include: {
                            model: Publication,
                            attributes: { exclude: ['publicationId', 'createdAt', 'updatedAt'] },
                            where: { status: 'Approved' },
                            required: true
                        },
                        order: [
                            [Unit, 'unit', 'ASC']
                            [Unit, PersonalInfo, 'lastName', 'ASC'],
                            [Unit, PersonalInfo, Publication, 'publicationDate', 'DESC']
                            [Unit, PersonalInfo, Publication, 'title', 'ASC']
                        ]
                    }
                }
            ]    
        })

        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_publishers.forEach((j) => { 
                    pubContent.push({
                        "Unit": i.unit.unit,
                        "Name": `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        "Title": j.faculty_publication.title,
                        "Citation": j.faculty_publication.citation,
                        "URL": j.faculty_publication.url,
                        "Publication Date": j.faculty_publication.publicationDate,
                        "Non Faculty Authors": j.faculty_publication.nonFacultyAuthors
                    })
                })
                
            })
        }
    }

    if(body.includes('trainingSeminar')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: Training,
                        attributes: { exclude: ['tsId', 'facultyId', 'proof', 'approverRemarks', 'createdAt', 'updatedAt'] },
                        required: true,
                        where: { status: 'Approved' }
                    },
                    order: [
                        [Unit, 'unit', 'ASC']
                        [Unit, PersonalInfo, 'lastName', 'ASC'],
                        [Unit, PersonalInfo, Training, 'dateFrom', 'DESC'],
                        [Unit, PersonalInfo, Training, 'title', 'ASC'],
                    ]
                }
            ]
        })
        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_training_seminars.forEach((j) => {
                    tsContent.push({
                        "Unit": i.unit.unit,
                        "Name": `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        "Role": j.role,
                        "Title": j.title,
                        "Date From": j.dateFrom,
                        "Date To": j.dateTo,
                        "Venue": j.venue,
                        "Remarks": j.remarks
                    })
                })
            })
        }
    }

    if(body.includes('researchGrant')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: Researcher,
                        required: true,
                        include: {
                            model: Research,
                            attributes: { exclude: ['researchId', 'createdAt', 'updatedAt'] },
                            where: { status: 'Approved' },
                            required: true
                        },
                        order: [
                            [Unit, 'unit', 'ASC']
                            [Unit, PersonalInfo, 'lastName', 'ASC'],
                            [Unit, PersonalInfo, Research, 'projectedStart', 'DESC'],
                            [Unit, PersonalInfo, Research, 'researchName', 'ASC'],
                        ]
                    }
                }
            ]    
        })

        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_researchers.forEach((j) => {
                    rgContent.push({
                        "Unit": i.unit.unit,
                        "Name": `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        "Research Name": j.faculty_research_grant.researchName,
                        "Granter": j.faculty_research_grant.granter,
                        "Amount": j.faculty_research_grant.amount,
                        "Projected Start": j.faculty_research_grant.projectedStart,
                        "Projected End": j.faculty_research_grant.projectedEnd,
                        "Actual Start": j.faculty_research_grant.actualStart,
                        "Actual End": j.faculty_research_grant.actualEnd,
                        "Research Progress": j.faculty_research_grant.researchProgress,
                        "Non Faculty Researchers": j.faculty_research_grant.nonFacultyResearchers
                    })
                })
            })
        }
    }

    if(body.includes('licensureExam')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: Licensure,
                        attributes: { exclude: ['licenseId', 'facultyId', 'proof', 'approverRemarks', 'createdAt', 'updatedAt'] },
                        required: true,
                        where: { status: 'Approved' }
                    },
                    order: [
                        [Unit, 'unit', 'ASC']
                        [Unit, PersonalInfo, 'lastName', 'ASC'],
                        [Unit, PersonalInfo, Licensure, 'examDate', 'DESC'],
                        [Unit, PersonalInfo, Licensure, 'examName', 'ASC']
                    ]
                }
            ]
        })

        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_licensure_exams.forEach((j) => {
                    leContent.push({
                        "Unit": i.unit.unit,
                        "Name": `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        "Exam Name": j.examName,
                        "Exam Date": j.examDate,
                        "License Number": j.licenseNumber,
                        "rank": j.rank
                    })
                })
            })
        }
    }

    if(body.includes('education')) {
        let facultyList = await FacultyUnit.findAll({
            where: where,
            attributes: ['facultyId'],
            include: [
                {
                    model: Unit,
                    attributes: ['unit']
                },
                {
                    model: PersonalInfo,
                    attributes: ['lastName', 'firstName'],
                    required: true,
                    include: {
                        model: Education,
                        attributes: { exclude: ['educInfoId', 'facultyId', 'proof', 'status', 'approverRemarks', 'createdAt', 'updatedAt'] },
                        required: true,
                        where: { status: 'Approved' }
                    },
                    order: [
                        [Unit, 'unit', 'ASC']
                        [Unit, PersonalInfo, 'lastName', 'ASC'],
                        [Unit, PersonalInfo, Education, 'startDate', 'DESC'],
                        [Unit, PersonalInfo, Education, 'institutionSchool', 'ASC']
                    ]
                }
            ]
        })
        if(facultyList.length > 0) {
            await facultyList.forEach( async (i) => { 
                i.faculty_personal_info.faculty_education_infos.forEach((j) => {
                    educContent.push({
                        "Unit": i.unit.unit,
                        "Name": `${i.faculty_personal_info.lastName}, ${i.faculty_personal_info.firstName}`,
                        "Institution/School": j.institutionSchool,
                        "Degree Type": j.degreeType,
                        "Degree Cert": j.degreeCert,
                        "Major/Specialization": j.majorSpecialization,
                        "Start Date": j.startDate,
                        "End Date": j.endDate
                    })
                })
            })
        }
    }

    const workbook = XLSX.utils.book_new()

    if (psContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(psContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Public Services")
    }

    if (pubContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(pubContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Publications")
    }

    if (tsContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(tsContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Training and Seminars")
    }

    if (rgContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(rgContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Research Grants")
    }

    if (leContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(leContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Licensure Exams")
    }

    if (educContent.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(educContent)
        XLSX.utils.book_append_sheet(workbook, worksheet, "Education")
    }

    if(workbook.SheetNames.length > 0) {
        XLSX.write(workbook, {bookType: 'xlsx', type: 'buffer'})
        XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'})
        XLSX.writeFile(workbook, "uploads/reports.xlsx")
        res.status(200)
        res.download("uploads/reports.xlsx")
    } else {
        jsonRes = {
            statusCode: 200,
            success: true,
            message: 'No records available'
        };
        util.sendResponse(res, jsonRes);   
    }
};

module.exports = reports;