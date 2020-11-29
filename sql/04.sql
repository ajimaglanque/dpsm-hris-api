ALTER TABLE `faculty_personal_infos` 
CHANGE `contactNumber` `mobile` VARCHAR(11) NOT NULL;

ALTER TABLE `faculty_personal_infos`
ADD `landline` VARCHAR(8);
