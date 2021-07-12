ALTER TABLE `faculty_employment_infos` DROP INDEX `position`;
ALTER TABLE `faculty_employment_infos` DROP FOREIGN KEY `faculty_employment_infos_ibfk_2`;
DROP TABLE `faculty_employment_positions`

CREATE TABLE `faculty_employment_positions` ( 
    `employmentPositionId` INT(3) NOT NULL AUTO_INCREMENT , 
    `position` VARCHAR(21) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`employmentPositionId`)
) ENGINE = InnoDB;

INSERT INTO `faculty_employment_positions` (`employmentPositionId`, `position`) VALUES 
(NULL, 'Instructor 1'), 
(NULL, 'Instructor 2'),
(NULL, 'Instructor 3'),
(NULL, 'Instructor 4'),
(NULL, 'Instructor 5'),
(NULL, 'Instructor 6'),
(NULL, 'Instructor 7'),
(NULL, 'Assistant Professor 1'),
(NULL, 'Assistant Professor 2'),
(NULL, 'Assistant Professor 3'),
(NULL, 'Assistant Professor 4'),
(NULL, 'Assistant Professor 5'),
(NULL, 'Assistant Professor 6'),
(NULL, 'Assistant Professor 7'),
(NULL, 'Associate Professor 1'),
(NULL, 'Associate Professor 2'),
(NULL, 'Associate Professor 3'),
(NULL, 'Associate Professor 4'),
(NULL, 'Associate Professor 5'),
(NULL, 'Associate Professor 6'),
(NULL, 'Associate Professor 7'),
(NULL, 'Professor 1'),
(NULL, 'Professor 2'),
(NULL, 'Professor 3'),
(NULL, 'Professor 4'),
(NULL, 'Professor 5'),
(NULL, 'Professor 6'),
(NULL, 'Professor 7'),
(NULL, 'Professor 8'),
(NULL, 'Professor 9'),
(NULL, 'Professor 10'),
(NULL, 'Professor 11'),
(NULL, 'Professor 12'),
(NULL, 'Lecturer 1'),
(NULL, 'Lecturer 2'),
(NULL, 'Senior Lecturer 1'),
(NULL, 'Senior Lecturer 2'),
(NULL, 'Senior Lecturer 3');

ALTER TABLE `faculty_employment_infos` ADD FOREIGN KEY (`employmentPositionId`) REFERENCES `faculty_employment_positions`(`employmentPositionId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `faculty_employment_infos` ADD `status` VARCHAR(9) NOT NULL AFTER `employmentPositionId`, ADD `category` VARCHAR(9) NOT NULL AFTER `status`;