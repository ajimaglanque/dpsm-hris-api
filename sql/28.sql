CREATE TABLE `faculty_updates` ( 
    `facultyId` INT(8) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL 
) ENGINE = InnoDB;

ALTER TABLE `faculty_updates` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_updates` DROP INDEX `facultyId`, ADD PRIMARY KEY (`facultyId`) USING BTREE;

ALTER TABLE `faculty_updates` CHANGE `lastUpdate` `lastUpdate` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `faculty_updates` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;