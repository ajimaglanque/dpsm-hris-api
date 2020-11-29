ALTER TABLE `faculty_education_infos`
ADD COLUMN `proof` VARCHAR(255),
ADD COLUMN `status` VARCHAR(20) NOT NULL DEFAULT 'ongoing';