ALTER TABLE `faculty_publications` 
CHANGE `title` `title` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
CHANGE `citation` `citation` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL, 
CHANGE `url` `url` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, 
CHANGE `nonFacultyAuthors` `nonFacultyAuthors` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL; 