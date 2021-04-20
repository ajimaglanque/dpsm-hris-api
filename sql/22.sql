ALTER TABLE `faculty_licensure_exams` 
CHANGE `status` `status` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending';

ALTER TABLE `faculty_public_services` 
CHANGE `status` `status` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending';

ALTER TABLE `faculty_publishers` 
CHANGE `status` `status` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending';

ALTER TABLE `faculty_researchers` 
CHANGE `status` `status` VARCHAR(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending';

ALTER TABLE `faculty_training_seminars` 
CHANGE `status` `status` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Pending';