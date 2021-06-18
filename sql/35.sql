ALTER TABLE `units` 
ADD `incomingUnitHead` INT(3) NULL AFTER `unit`, 
ADD `approverRemarks` VARCHAR(200) NULL AFTER `incomingUnitHead`;

ALTER TABLE `units` 
ADD FOREIGN KEY (`incomingUnitHead`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

DROP TABLE `faculty_unit_assignments`