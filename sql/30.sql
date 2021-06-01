ALTER TABLE `faculty_class_records` CHANGE `classRecord` `setResults` VARCHAR(150) NULL;

ALTER TABLE `faculty_class_records` ADD `syllabus` VARCHAR(150) NULL AFTER `setResults`;

ALTER TABLE `faculty_class_records` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_class_records` CHANGE `updatedAt` `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;