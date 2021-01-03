CREATE TABLE `faculty_public_services` ( 
    `publicServiceId` INT NOT NULL AUTO_INCREMENT , 
    `facultyId` INT NOT NULL , 
    `type` VARCHAR(10) NOT NULL , 
    `position` VARCHAR(50) NOT NULL , 
    `organization` VARCHAR(50) NOT NULL , 
    `description` TEXT NOT NULL , 
    `startDate` DATE NOT NULL , 
    `endDate` DATE NOT NULL , 
    `proof` VARCHAR(100) NOT NULL , 
    `status` VARCHAR(20) NOT NULL ,
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL,
     PRIMARY KEY (`publicServiceId`)
) ENGINE = InnoDB;