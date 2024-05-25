-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db1.servers.com.de:3306
-- Erstellungszeit: 25. Mai 2024 um 12:02
-- Server-Version: 11.3.2-MariaDB-1:11.3.2+maria~ubu2204
-- PHP-Version: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `s16_counting`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `CurrentCount`
--

CREATE TABLE `CurrentCount` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL DEFAULT 0,
  `senderId` bigint(20) DEFAULT NULL,
  `target` int(11) DEFAULT 0,
  `mode` varchar(255) DEFAULT uuid()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `CurrentCount`
--

INSERT INTO `CurrentCount` (`id`, `number`, `senderId`, `target`, `mode`) VALUES
(1, 0, NULL, -63, 'negative'),
(2, -1, 815643695076212757, 0, 'a111b425-1a75-11ef-a108-0242ac110003'),
(3, -2, 760155365710102549, 0, 'c89cb8a9-1a75-11ef-a108-0242ac110003'),
(4, -3, 798111822553153546, 0, 'fa7ae950-1a75-11ef-a108-0242ac110003'),
(5, -4, 760155365710102549, 0, '182bb092-1a76-11ef-a108-0242ac110003'),
(6, -5, 784453231778594856, 0, '836f2023-1a7c-11ef-a108-0242ac110003'),
(7, -6, 760155365710102549, 0, 'd1bf147e-1a7c-11ef-a108-0242ac110003'),
(8, -7, 784453231778594856, 0, '0974417e-1a7d-11ef-a108-0242ac110003'),
(9, -8, 760155365710102549, 0, '12f5417f-1a7d-11ef-a108-0242ac110003');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `CurrentCount`
--
ALTER TABLE `CurrentCount`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `CurrentCount`
--
ALTER TABLE `CurrentCount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
