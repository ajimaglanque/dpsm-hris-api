ALTER TABLE `faculty_researchers` 
ADD `proof` VARCHAR(100) NULL AFTER `facultyId`, 
ADD `status` VARCHAR(20) NOT NULL AFTER `proof`, 
ADD `createdAt` TIMESTAMP NOT NULL AFTER `status`, 
ADD `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `createdAt`;

ALTER TABLE `faculty_research_grants`
  DROP `proof`,
  DROP `status`;
