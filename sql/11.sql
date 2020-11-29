CREATE TABLE `faculty_licensure_exams` ( 
    `licenseId` INT NOT NULL AUTO_INCREMENT ,
    `facultyId` INT(8) NOT NULL , 
    `examName` VARCHAR(50) NOT NULL , 
    `examDate` DATE NOT NULL , 
    `licenseNumber` VARCHAR(50) NOT NULL , 
    `rank` INT(3) NULL , 
    `proof` VARCHAR(100) NOT NULL , 
    `status` VARCHAR(20) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL ,
    PRIMARY KEY (`licenseId`)
) ENGINE = InnoDB;

ALTER TABLE `faculty_licensure_exams` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;