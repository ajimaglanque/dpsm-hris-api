ALTER TABLE `faculty_education_infos` ADD `degreeType` VARCHAR(10) NULL AFTER `institutionSchool`;

ALTER TABLE `faculty_publications` CHANGE `journal` `citation` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

ALTER TABLE `faculty_personal_infos` ADD `dependents` VARCHAR(50) NULL AFTER `emergencyContactNumber`;