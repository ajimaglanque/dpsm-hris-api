ALTER TABLE `faculty_employment_infos` CHANGE `position` `employmentPositionId` INT(2) NOT NULL;

ALTER TABLE `faculty_dependents` CHANGE `birthdate` `birthdate` DATE NULL DEFAULT NULL;

ALTER TABLE `faculty_dependents` CHANGE `updatedAt` `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_dependents` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_education_infos` CHANGE `endDate` `endDate` DATE NULL DEFAULT NULL;

ALTER TABLE `faculty_evaluations` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_evaluations` CHANGE `updatedAt` `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_licensure_exams` CHANGE `proof` `proof` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;

ALTER TABLE `faculty_licensure_exams` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_licensure_exams` CHANGE `updatedAt` `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_public_services` CHANGE `endDate` `endDate` DATE NULL DEFAULT NULL;

ALTER TABLE `faculty_public_services` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_public_services` CHANGE `updatedAt` `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_research_grants` CHANGE `actualStart` `actualStart` DATE NULL DEFAULT NULL;

ALTER TABLE `faculty_research_grants` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_research_grants` CHANGE `updatedAt` `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;