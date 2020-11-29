RENAME TABLE `faculty_units` TO `units`;

CREATE TABLE IF NOT EXISTS `faculty_units` (
  `facultyId` int(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `unitId` int(1) NOT NULL ,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `faculty_employment_infos`
DROP FOREIGN KEY faculty_employment_infos_ibfk_2;

ALTER TABLE `faculty_employment_infos`
DROP COLUMN `unitId`;

ALTER TABLE `faculty_units` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_units` 
ADD FOREIGN KEY (`unitId`) 
REFERENCES `units`(`unitId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;