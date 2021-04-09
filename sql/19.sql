CREATE TABLE `faculty_dependents` ( 
    `dependentId` INT(8) NOT NULL AUTO_INCREMENT , 
    `facultyId` INT(8) NOT NULL , 
    `name` VARCHAR(100) NOT NULL , 
    `birthdate` DATE NOT NULL , 
    `relationship` VARCHAR(20) NOT NULL ,
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL ,
    PRIMARY KEY (`dependentId`)
) ENGINE = InnoDB;

ALTER TABLE `faculty_dependents` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_personal_infos` 
DROP `dependents`;