ALTER TABLE `faculty_education_infos` 
CHANGE `status` `status` VARCHAR(20) 
CHARACTER SET utf8 COLLATE utf8_general_ci 
NOT NULL DEFAULT 'pending';

ALTER TABLE `faculty_publishers` 
CHANGE `status` `status` VARCHAR(25) 
CHARACTER SET utf8 COLLATE utf8_general_ci 
NOT NULL DEFAULT 'pending';

ALTER TABLE `faculty_publishers` 
DROP FOREIGN KEY faculty_publishers_ibfk_1;

ALTER TABLE `faculty_publishers` 
DROP FOREIGN KEY faculty_publishers_ibfk_2;

ALTER TABLE `faculty_publishers` 
CHANGE `publicationId` `publicationId` INT(8) NOT NULL;

ALTER TABLE `faculty_publishers` DROP PRIMARY KEY;

ALTER TABLE `faculty_publishers` DROP INDEX `facultyId`;

ALTER TABLE `faculty_publishers` 
CHANGE `proof` `proof` VARCHAR(100) 
CHARACTER SET utf8 COLLATE utf8_general_ci NULL;