ALTER TABLE `users` CHANGE `username` `upemail` VARCHAR(255) 
CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;

ALTER TABLE `users` ADD UNIQUE(`upemail`);

ALTER TABLE `users` ADD `role` INT(2) NOT NULL AFTER `userId`;

CREATE TABLE `roles` ( 
    `role` VARCHAR(20) NOT NULL , 
    `roleId` INT(3) NOT NULL AUTO_INCREMENT, 
    PRIMARY KEY (`roleId`)
) ENGINE = InnoDB;

INSERT INTO `roles` (`roleId`, `role`) VALUES 
(NULL, 'Faculty'),
(NULL, 'Unit Head'), 
(NULL, 'Department Chair'),
(NULL, 'DAPC'), 
(NULL, 'Admin Staff');

ALTER TABLE `users` ADD FOREIGN KEY (`role`) REFERENCES `roles`(`roleId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `faculty_personal_infos` ADD `userId` INT NOT NULL AFTER `facultyId`;

ALTER TABLE `faculty_personal_infos` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT;