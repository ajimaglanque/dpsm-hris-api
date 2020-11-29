CREATE TABLE `faculty_training_seminars` ( 
    `tsId` INT NOT NULL AUTO_INCREMENT , 
    `facultyId` INT NOT NULL ,
    `role` VARCHAR(50) NOT NULL ,
    `title` VARCHAR(100) NOT NULL , 
    `dateFrom` DATE NOT NULL , 
    `dateTo` DATE NULL , 
    `venue` VARCHAR(100) NOT NULL , 
    `proof` VARCHAR(100) NULL , 
    `status` VARCHAR(20) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (`tsId`)
) ENGINE = InnoDB;

ALTER TABLE `faculty_training_seminars` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_publishers` 
ADD FOREIGN KEY (`publicationId`) 
REFERENCES `faculty_publications`(`publicationId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_publishers`
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;