ALTER TABLE `faculty_education_infos`
MODIFY `majorSpecialization` VARCHAR(50);

ALTER TABLE `faculty_work_exp_infos`
ADD `description` TEXT;

ALTER TABLE `faculty_publications`
CHANGE `publication` `title` VARCHAR(100) NOT NULL;

ALTER TABLE `faculty_publications`
ADD COLUMN `journal` VARCHAR (50) NOT NULL,
ADD COLUMN `url` VARCHAR(100),
ADD COLUMN `nonFacultyAuthors` VARCHAR(150);

ALTER TABLE `faculty_publications` 
DROP `facultyId`;

CREATE TABLE IF NOT EXISTS `faculty_publishers` (
  `publicationId` INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `facultyId` int(8) NOT NULL,
  `proof` VARCHAR(100) NOT NULL,
  `status` VARCHAR(25) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `faculty_publishers` 
ADD FOREIGN KEY (`publicationId`) 
REFERENCES `faculty_publications`(`publicationId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_publishers` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;