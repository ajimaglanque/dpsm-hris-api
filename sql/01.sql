-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2020 at 09:07 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dpsm-hris-dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni_personal_infos`
--

CREATE TABLE IF NOT EXISTS `alumni_personal_infos` (
  `alumniId` int(8) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `contactNumber` varchar(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Table structure for table `alumni_work_exp_infos`
--

CREATE TABLE IF NOT EXISTS `alumni_work_exp_infos` (
  `workExpId` int(8) NOT NULL,
  `alumniId` int(8) NOT NULL,
  `employerName` varchar(50) NOT NULL,
  `position` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_education_infos`
--

CREATE TABLE IF NOT EXISTS `faculty_education_infos` (
  `educInfoId` int(8) NOT NULL,
  `facultyId` int(8) NOT NULL,
  `institutionSchool` varchar(50) NOT NULL,
  `degreeCert` varchar(50) NOT NULL,
  `majorSpecialization` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_employment_infos`
--

CREATE TABLE IF NOT EXISTS `faculty_employment_infos` (
  `employmentInfoId` int(8) NOT NULL,
  `facultyId` int(8) NOT NULL,
  `unitId` int(1) NOT NULL,
  `position` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_personal_infos`
--

CREATE TABLE IF NOT EXISTS `faculty_personal_infos` (
  `facultyId` int(8) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `dateOfBirth` date NOT NULL,
  `placeOfBirth` varchar(50) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `permanentAddress` varchar(255) NOT NULL,
  `presentAddress` varchar(255) NOT NULL,
  `contactNumber` varchar(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `civilStatus` varchar(10) NOT NULL,
  `religion` varchar(50) NOT NULL,
  `emergencyContactPerson` varchar(100) NOT NULL,
  `emergencyContactNumber` varchar(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_publications`
--

CREATE TABLE IF NOT EXISTS `faculty_publications` (
  `publicationId` int(8) NOT NULL,
  `facultyId` int(8) NOT NULL,
  `publication` varchar(150) NOT NULL,
  `publicationDate` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_units`
--

CREATE TABLE IF NOT EXISTS `faculty_units` (
  `unitId` int(1) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_work_exp_infos`
--

CREATE TABLE IF NOT EXISTS `faculty_work_exp_infos` (
  `workExpId` int(8) NOT NULL,
  `facultyId` int(8) NOT NULL,
  `employerName` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `position` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student_personal_infos`
--

CREATE TABLE IF NOT EXISTS `student_personal_infos` (
  `studentId` int(8) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `dateOfBirth` date NOT NULL,
  `placeOfBirth` varchar(50) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `permanentAddress` varchar(255) NOT NULL,
  `presentAddress` varchar(255) NOT NULL,
  `contactNumber` varchar(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `civilStatus` varchar(10) NOT NULL,
  `religion` varchar(50) NOT NULL,
  `emergencyContactPerson` varchar(100) NOT NULL,
  `emergencyContactNumber` varchar(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student_programs`
--

CREATE TABLE IF NOT EXISTS `student_programs` (
  `programId` int(1) NOT NULL,
  `unitId` int(11) NOT NULL,
  `classification` varchar(9) NOT NULL,
  `program` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni_personal_infos`
--
ALTER TABLE `alumni_personal_infos`
  ADD PRIMARY KEY (`alumniId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `alumni_work_exp_infos`
--
ALTER TABLE `alumni_work_exp_infos`
  ADD PRIMARY KEY (`workExpId`),
  ADD KEY `alumni_work_experience_info_ibfk_1` (`alumniId`);

--
-- Indexes for table `faculty_education_infos`
--
ALTER TABLE `faculty_education_infos`
  ADD PRIMARY KEY (`educInfoId`),
  ADD KEY `facultyId` (`facultyId`);

--
-- Indexes for table `faculty_employment_infos`
--
ALTER TABLE `faculty_employment_infos`
  ADD PRIMARY KEY (`employmentInfoId`),
  ADD KEY `faculty_employment_info_ibfk_1` (`facultyId`),
  ADD KEY `faculty_employment_info_ibfk_2` (`unitId`);

--
-- Indexes for table `faculty_personal_infos`
--
ALTER TABLE `faculty_personal_infos`
  ADD PRIMARY KEY (`facultyId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `faculty_publications`
--
ALTER TABLE `faculty_publications`
  ADD PRIMARY KEY (`publicationId`);

--
-- Indexes for table `faculty_units`
--
ALTER TABLE `faculty_units`
  ADD PRIMARY KEY (`unitId`);

--
-- Indexes for table `faculty_work_exp_infos`
--
ALTER TABLE `faculty_work_exp_infos`
  ADD PRIMARY KEY (`workExpId`),
  ADD KEY `faculty_work_experience_info_ibfk_1` (`facultyId`);

--
-- Indexes for table `student_personal_infos`
--
ALTER TABLE `student_personal_infos`
  ADD PRIMARY KEY (`studentId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student_programs`
--
ALTER TABLE `student_programs`
  ADD PRIMARY KEY (`programId`),
  ADD KEY `unitId` (`unitId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni_personal_infos`
--
ALTER TABLE `alumni_personal_infos`
  MODIFY `alumniId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alumni_work_exp_infos`
--
ALTER TABLE `alumni_work_exp_infos`
  MODIFY `workExpId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_education_infos`
--
ALTER TABLE `faculty_education_infos`
  MODIFY `educInfoId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_employment_infos`
--
ALTER TABLE `faculty_employment_infos`
  MODIFY `employmentInfoId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_personal_infos`
--
ALTER TABLE `faculty_personal_infos`
  MODIFY `facultyId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_publications`
--
ALTER TABLE `faculty_publications`
  MODIFY `publicationId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_units`
--
ALTER TABLE `faculty_units`
  MODIFY `unitId` int(1) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty_work_exp_infos`
--
ALTER TABLE `faculty_work_exp_infos`
  MODIFY `workExpId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_personal_infos`
--
ALTER TABLE `student_personal_infos`
  MODIFY `studentId` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_programs`
--
ALTER TABLE `student_programs`
  MODIFY `programId` int(1) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alumni_work_exp_infos`
--
ALTER TABLE `alumni_work_exp_infos`
  ADD CONSTRAINT `alumni_work_exp_infos_ibfk_1` FOREIGN KEY (`alumniId`) REFERENCES `alumni_personal_infos` (`alumniId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `faculty_education_infos`
--
ALTER TABLE `faculty_education_infos`
  ADD CONSTRAINT `faculty_education_infos_ibfk_1` FOREIGN KEY (`facultyId`) REFERENCES `faculty_personal_infos` (`facultyId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `faculty_employment_infos`
--
ALTER TABLE `faculty_employment_infos`
  ADD CONSTRAINT `faculty_employment_infos_ibfk_1` FOREIGN KEY (`facultyId`) REFERENCES `faculty_personal_infos` (`facultyId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `faculty_employment_infos_ibfk_2` FOREIGN KEY (`unitId`) REFERENCES `faculty_units` (`unitId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `faculty_work_exp_infos`
--
ALTER TABLE `faculty_work_exp_infos`
  ADD CONSTRAINT `faculty_work_exp_infos_ibfk_1` FOREIGN KEY (`facultyId`) REFERENCES `faculty_personal_infos` (`facultyId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_programs`
--
ALTER TABLE `student_programs`
  ADD CONSTRAINT `student_programs_ibfk_1` FOREIGN KEY (`unitId`) REFERENCES `faculty_units` (`unitId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
