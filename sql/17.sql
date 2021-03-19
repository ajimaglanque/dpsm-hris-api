CREATE TABLE `faculty_class_records` ( 
    `recordId` INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY , 
    `facultyId` INT(8) NOT NULL , 
    `academicYear` VARCHAR(50) NOT NULL , 
    `subject` VARCHAR(20) NOT NULL , 
    `section` VARCHAR(5) NOT NULL ,
    `classRecord` VARCHAR(150) NOT NULL ,
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL ,
) ENGINE = InnoDB;

ALTER TABLE `faculty_class_records` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `faculty_evaluations` ( 
    `evaluationId` INT(8) NOT NULL AUTO_INCREMENT , 
    `facultyId` INT(8) NOT NULL , 
    `evaluatee` INT(8) NOT NULL , 
    `academicYear` VARCHAR(50) NOT NULL , 
    `evaluation` FLOAT(4) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL ,
    PRIMARY KEY (`evaluationId`)
) ENGINE = InnoDB;

ALTER TABLE `faculty_evaluations` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_evaluations` 
ADD FOREIGN KEY (`evaluatee`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;