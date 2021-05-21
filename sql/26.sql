ALTER TABLE `faculty_education_infos` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;

ALTER TABLE `faculty_public_services` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;

ALTER TABLE `faculty_publishers` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;

ALTER TABLE `faculty_training_seminars` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;

ALTER TABLE `faculty_licensure_exams` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;

ALTER TABLE `faculty_researchers` ADD `approverRemarks` VARCHAR(100) NULL AFTER `status`;