
ALTER TABLE `faculty_publications` ADD `proof` VARCHAR(100) NULL AFTER `nonFacultyAuthors`, ADD `status` VARCHAR(25) NOT NULL DEFAULT 'Pending' AFTER `proof`, ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`; 

ALTER TABLE `faculty_publications` CHANGE `proof` `proof` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL; 

ALTER TABLE `faculty_publishers`
  DROP `proof`,
  DROP `status`,
  DROP `approverRemarks`; 

ALTER TABLE `faculty_research_grants` ADD `proof` VARCHAR(255) NULL AFTER `nonFacultyResearchers`, ADD `status` VARCHAR(25) NOT NULL DEFAULT 'Pending' AFTER `proof`, ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`; 

ALTER TABLE `faculty_researchers`
  DROP `proof`,
  DROP `status`,
  DROP `approverRemarks`; 