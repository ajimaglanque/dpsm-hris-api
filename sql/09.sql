CREATE TABLE `faculty_employment_positions` ( 
    `employmentPositionId` INT(3) NOT NULL AUTO_INCREMENT , 
    `employmentType` VARCHAR(3) NOT NULL , 
    `position` VARCHAR(21) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (`employmentPositionId`)
) ENGINE = InnoDB;

INSERT INTO `faculty_employment_positions` (`employmentPositionId`, `employmentType`, `position`) VALUES 
(NULL, 'ftt', 'Instructor 1'), 
(NULL, 'ftt', 'Instructor 2'),
(NULL, 'ftt', 'Instructor 3'),
(NULL, 'ftt', 'Instructor 4'),
(NULL, 'ftt', 'Instructor 5'),
(NULL, 'ftt', 'Instructor 6'),
(NULL, 'ftt', 'Instructor 7'),
(NULL, 'ftt', 'Assistant Professor 1'),
(NULL, 'ftt', 'Assistant Professor 2'),
(NULL, 'ftt', 'Assistant Professor 3'),
(NULL, 'ftt', 'Assistant Professor 4'),
(NULL, 'ftt', 'Assistant Professor 5'),
(NULL, 'ftt', 'Assistant Professor 6'),
(NULL, 'ftt', 'Assistant Professor 7'),
(NULL, 'ftp', 'Assistant Professor 1'),
(NULL, 'ftp', 'Assistant Professor 2'),
(NULL, 'ftp', 'Assistant Professor 3'),
(NULL, 'ftp', 'Assistant Professor 4'),
(NULL, 'ftp', 'Assistant Professor 5'),
(NULL, 'ftp', 'Assistant Professor 6'),
(NULL, 'ftp', 'Assistant Professor 7'),
(NULL, 'ftp', 'Associate Professor 1'),
(NULL, 'ftp', 'Associate Professor 2'),
(NULL, 'ftp', 'Associate Professor 3'),
(NULL, 'ftp', 'Associate Professor 4'),
(NULL, 'ftp', 'Associate Professor 5'),
(NULL, 'ftp', 'Associate Professor 6'),
(NULL, 'ftp', 'Associate Professor 7'),
(NULL, 'ftp', 'Professor 1'),
(NULL, 'ftp', 'Professor 2'),
(NULL, 'ftp', 'Professor 3'),
(NULL, 'ftp', 'Professor 4'),
(NULL, 'ftp', 'Professor 5'),
(NULL, 'ftp', 'Professor 6'),
(NULL, 'ftp', 'Professor 7'),
(NULL, 'ftp', 'Professor 8'),
(NULL, 'ftp', 'Professor 9'),
(NULL, 'ftp', 'Professor 10'),
(NULL, 'ftp', 'Professor 11'),
(NULL, 'ftp', 'Professor 12'),
(NULL, 'pt', 'Lecturer 1'),
(NULL, 'pt', 'Lecturer 2'),
(NULL, 'pt', 'Senior Lecturer 1'),
(NULL, 'pt', 'Senior Lecturer 2'),
(NULL, 'pt', 'Senior Lecturer 3');

ALTER TABLE `faculty_employment_infos` 
CHANGE `position` `position` INT(2) NOT NULL;

ALTER TABLE `faculty_employment_infos` 
ADD FOREIGN KEY (`position`) 
REFERENCES `faculty_employment_positions`(`employmentPositionId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;