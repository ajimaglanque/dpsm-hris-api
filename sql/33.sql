CREATE TABLE `faculty_unit_assignments` ( 
    `unitId` INT(3) NOT NULL , 
    `incomingUnitHead` INT(3) NOT NULL , 
    `approverRemarks` VARCHAR(200) NULL , 
    PRIMARY KEY (`unitId`)
) ENGINE = InnoDB;

ALTER TABLE `faculty_unit_assignments` 
ADD FOREIGN KEY (`incomingUnitHead`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_unit_assignments` 
ADD FOREIGN KEY (`unitId`) 
REFERENCES `units`(`unitId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_unit_assignments` 
ADD UNIQUE(`incomingUnitHead`);

ALTER TABLE `faculty_unit_assignments` 
ADD `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `approverRemarks`, 
ADD `updatedAt` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `createdAt`;