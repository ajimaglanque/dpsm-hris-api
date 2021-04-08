CREATE TABLE `faculty_research_grants` ( 
    `researchGrantId` INT(8) NOT NULL AUTO_INCREMENT , 
    `researchName` VARCHAR(100) NOT NULL , 
    `granter` VARCHAR(100) NOT NULL , 
    `amount` INT(11) NOT NULL , 
    `projectedStart` DATE NOT NULL , 
    `projectedEnd` DATE NULL , 
    `actualStart` DATE NOT NULL , 
    `actualEnd` DATE NULL , 
    `researchProgress` VARCHAR(20) NOT NULL , 
    `nonFacultyResearchers` VARCHAR(100) NOT NULL , 
    `proof` VARCHAR(100) NULL , 
    `status` VARCHAR(20) NOT NULL , 
    `createdAt` TIMESTAMP NOT NULL , 
    `updatedAt` TIMESTAMP NOT NULL , 
    PRIMARY KEY (`researchGrantId`)
) ENGINE = InnoDB;

CREATE TABLE faculty_researchers (
  publisherId int(8) NOT NULL,
  publicationId int(8) NOT NULL,
  facultyId int(8) NOT NULL,
  proof varchar(100) DEFAULT NULL,
  status varchar(25) NOT NULL DEFAULT 'Pending',
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `faculty_researchers` 
ADD PRIMARY KEY( `publisherId`); 

ALTER TABLE `faculty_researchers` 
CHANGE `publisherId` `researcherId` INT(8) NOT NULL AUTO_INCREMENT, 
CHANGE `publicationId` `researchId` INT(8) NOT NULL;

ALTER TABLE `faculty_researchers` 
ADD FOREIGN KEY (`facultyId`) 
REFERENCES `faculty_personal_infos`(`facultyId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT; 

ALTER TABLE `faculty_researchers` 
ADD FOREIGN KEY (`researchId`) 
REFERENCES `faculty_research_grants`(`researchGrantId`) 
ON DELETE RESTRICT ON UPDATE RESTRICT;