-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2021 at 06:38 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lovefind`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) UNSIGNED NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `status`, `created_at`) VALUES
(9, 'love', 1, '2021-08-03 13:15:33');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`id`, `following_id`, `follower_id`, `created_at`) VALUES
(64, 28, 1, '2021-08-04 21:16:25'),
(66, 26, 28, '2021-08-04 21:16:25'),
(67, 28, 26, '2021-08-04 21:16:30'),
(69, 1, 28, '2021-08-05 07:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(34, 45, 27, '2021-08-03 13:17:12'),
(35, 61, 1, '2021-08-05 07:22:03'),
(36, 78, 1, '2021-08-05 14:18:08'),
(37, 74, 1, '2021-08-05 15:54:01');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `img` text DEFAULT NULL,
  `category_id` int(11) UNSIGNED NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `user_id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `view` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `img`, `category_id`, `status`, `user_id`, `created_at`, `view`) VALUES
(61, 'prantho', 'njj;jkl', 'fileupload-1628175202293.PNG', 9, 1, 1, '2021-08-05 16:06:36', 1),
(63, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 16:06:38', 1),
(64, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 16:06:40', 1),
(65, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 16:06:42', 1),
(66, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 16:06:44', 1),
(67, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 16:07:13', 1),
(68, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 16:07:16', 1),
(69, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 16:14:01', 1),
(70, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 16:14:04', 1),
(71, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 16:14:06', 1),
(72, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 0, 29, '2021-08-05 15:39:34', 1),
(73, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 0, 28, '2021-08-05 15:39:52', 1),
(74, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 07:39:05', 1),
(75, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 07:39:05', 1),
(76, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 07:39:05', 1),
(77, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 28, '2021-08-05 07:39:05', 1),
(78, 'prantho', 'njj;jkl', 'fileupload-1628149145137.PNG', 9, 1, 29, '2021-08-05 14:18:13', 2),
(79, 'prantho is good', 'pranhot', 'file-1628178404737.PNG', 9, 1, 1, '2021-08-05 15:47:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `email` text NOT NULL,
  `phone` varchar(100) NOT NULL,
  `division` varchar(50) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `role` text NOT NULL DEFAULT 'User',
  `avatar` text DEFAULT NULL,
  `cover` text DEFAULT NULL,
  `password` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `gender`, `email`, `phone`, `division`, `city`, `address`, `role`, `avatar`, `cover`, `password`, `status`, `active`, `created_at`) VALUES
(1, 'admin', 'Male', 'admin@gmail.com', '+1 (629) 617-8156     ', 'Dhaka', 'Dhaka', 'Quam sed voluptatibu', 'Admin', NULL, 'file_cover-1627997227718.PNG', '$2b$10$n2AalzgnXEgtTnzqi0AmKuMlBkfp2rVg.0iQHpxBsj/lM2tHKXD1O', 1, 1, '2021-08-05 16:31:17'),
(26, 'shopno', 'Male', 'sopno@gmail.com', '+1 (629) 617-8156    ', 'Dhaka', 'Kishoreganj', 'Quam sed voluptatibu', 'User', 'avatar-1627913715537.PNG', 'file_cover-1626814453627.PNG', '$2b$10$n2AalzgnXEgtTnzqi0AmKuMlBkfp2rVg.0iQHpxBsj/lM2tHKXD1O', 1, 0, '2021-08-03 13:20:14'),
(28, 'Fletcher', 'Female', 'vagow@mailinator.com', '+1 (756) 635-3206', 'Rangpur', 'Dinajpur', 'Molestiae pariatur ', 'User', NULL, NULL, '$2b$10$nZhW2DpktBh6CMbT71RCf.tsZFssKkw/BS3vss/CGjf8zzqq5Z8P6', 1, 0, '2021-08-05 15:35:28'),
(29, 'puspita', 'Female', 'vago@mailinator.com', '+1 (756) 635-3206', 'Rangpur', 'Dinajpur', 'Molestiae pariatur ', 'User', NULL, NULL, '$2b$10$nZhW2DpktBh6CMbT71RCf.tsZFssKkw/BS3vss/CGjf8zzqq5Z8P6', 1, 0, '2021-08-05 15:35:31'),
(30, 'Ava', 'Female', 'ricuhyr@mailinator.com', '+1 (978) 274-5872', 'Dhaka', 'Narsingdi', 'Cupidatat quo et eiu', 'User', NULL, NULL, '$2b$10$I6WgtijX9kmkp8RyWbYsu.gP/HuyGUTPtYwfhGYF.1fV3z84PAlPq', 0, 0, '2021-08-05 16:21:12'),
(31, 'Jasmine', 'Female', 'cevopef@mailinator.com', '+1 (562) 122-1178', 'Khulna', 'Khulna', 'Dolorem dolore qui i', 'User', NULL, NULL, '$2b$10$jqIpTTm7sTJsI7EGF0E8U.l8DNP7R6IVgu5pMkc2o6b.SfWAE7qnO', 0, 0, '2021-08-05 16:23:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_fk` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `category_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
