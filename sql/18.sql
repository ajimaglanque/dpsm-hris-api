ALTER TABLE `faculty_public_services` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_personal_infos` 
ADD `suffix` VARCHAR(3) NULL AFTER `middleName`;