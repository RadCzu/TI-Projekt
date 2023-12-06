-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2023 at 10:32 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uzbrojenie`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `bron`
--

CREATE TABLE `bron` (
  `IdBroni` int(11) NOT NULL,
  `Opis` varchar(800) NOT NULL,
  `LinkObrazka` varchar(200) DEFAULT NULL,
  `Nazwa` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `bron`
--

INSERT INTO `bron` (`IdBroni`, `Opis`, `LinkObrazka`, `Nazwa`) VALUES
(1, 'Miecz jednoręczny to wszechstronna broń, znana ze swojej szybkości i zwinności w walce. Solidna konstrukcja umożliwia sprawne władanie i mocne uderzenia przy zachowaniu swobody drugiej ręki.', 'https://media.discordapp.net/attachments/499670303442731018/1176656039509245962/shortsword-solin-larp-weapon--614128-1.png?ex=656fa955&is=655d3455&hm=b5f1d617b5895e3bafa7687eab2c381ed0ca4a57dc0159e440', 'Miecz jednoręczny'),
(2, 'Miecz dwuręczny, znany również jako claymore, to imponująca broń o potężnym zasięgu i sile uderzenia', 'https://media.discordapp.net/attachments/499670303442731018/1176656184854454332/517wM9N8AL.png?ex=65', 'Miecz dwuręczny'),
(3, 'Korbacz to egzotyczna broń, charakteryzująca się łańcuchem i niezwykłym stylem. Jego nietypowa forma daje dzierżącemu go zbrojnemu przewagę w zaskoczeniu przeciwnika.', 'https://media.discordapp.net/attachments/499670303442731018/1176656737105887272/ZS-200611.png?ex=656', 'Korbacz'),
(4, 'chleb', 'https://media.discordapp.net/attachments/499670303442731018/1176656893121400882/cobs-product-pane-di-casa-baguette.png?ex=656faa20&is=655d3520&hm=0ddb1e28dd5db81fc6cc08ed9549d44326fbc2eeb9c6822ab181ab', 'Bagietka'),
(5, 'Stara dobra dzida', 'https://media.discordapp.net/attachments/499670303442731018/1177609936524550174/viking_spear_large.png?ex=657321b7&is=6560acb7&hm=c46999ddd78fa25dc53de91420c93bca812bf30bc813570734ff312d409c6b80&=&for', 'Włócznia');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `bron_slowaklucze`
--

CREATE TABLE `bron_slowaklucze` (
  `SlowaKlucze` varchar(50) NOT NULL,
  `IdBroni` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `bron_slowaklucze`
--

INSERT INTO `bron_slowaklucze` (`SlowaKlucze`, `IdBroni`) VALUES
('bagietka', 4),
('chleb', 4),
('claymore', 2),
('drzewcowa', 5),
('dwuręczny', 2),
('dwuręczny', 4),
('dzida', 5),
('jednoręczny', 1),
('jednoręczny', 3),
('korbacz', 3),
('miecz', 1),
('miecz', 2),
('miecz dwuręczny', 2),
('miecz jednoręczny', 1),
('obuchowa', 3),
('włucznia', 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `recenzja`
--

CREATE TABLE `recenzja` (
  `Ocena` int(11) NOT NULL,
  `NazwaProfilu` varchar(50) NOT NULL,
  `Data` date NOT NULL,
  `Godzina` varchar(5) NOT NULL,
  `IdRecenzji` int(11) NOT NULL,
  `Opis` varchar(1000) NOT NULL,
  `IdBroni` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `recenzja`
--

INSERT INTO `recenzja` (`Ocena`, `NazwaProfilu`, `Data`, `Godzina`, `IdRecenzji`, `Opis`, `IdBroni`) VALUES
(50, 'Zawisza Czarny', '1410-07-15', '16:32', 1, 'Miecz dwuręczny to wszakże najzacniejszy z oręży broń! Niemiec płakał jak żem ciachał', 2),
(45, 'Rycerz Piekarz', '2023-11-02', '22:28', 2, 'Bardzo chrupki', 4),
(10, 'Radek', '2023-11-02', '22:29', 3, 'Kruchy, drogi i tępy. Bardzo słaby oręż. Nie polecam.', 4),
(40, 'KorbaczGaming', '2023-11-02', '22:30', 4, 'Fajne kule', 3),
(40, 'Ciachacz1094', '2023-11-02', '22:30', 5, 'Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach Ciach ', 1),
(30, 'Lancelot', '2023-11-02', '22:31', 6, 'Polecam.', 1),
(20, 'Czarny Rycerz', '2023-11-02', '22:38', 7, 'Kule są niepraktyczne, nie zadają wiele obrażeń.', 3),
(40, 'Radek', '2023-11-02', '22:42', 8, 'Dobrze tnie, nie zajmuje dużo miejsca.', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `bron`
--
ALTER TABLE `bron`
  ADD PRIMARY KEY (`IdBroni`);

--
-- Indeksy dla tabeli `bron_slowaklucze`
--
ALTER TABLE `bron_slowaklucze`
  ADD PRIMARY KEY (`SlowaKlucze`,`IdBroni`),
  ADD KEY `IdBroni` (`IdBroni`);

--
-- Indeksy dla tabeli `recenzja`
--
ALTER TABLE `recenzja`
  ADD PRIMARY KEY (`IdRecenzji`,`IdBroni`),
  ADD KEY `IdBroni` (`IdBroni`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bron`
--
ALTER TABLE `bron`
  MODIFY `IdBroni` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `recenzja`
--
ALTER TABLE `recenzja`
  MODIFY `IdRecenzji` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bron_slowaklucze`
--
ALTER TABLE `bron_slowaklucze`
  ADD CONSTRAINT `bron_slowaklucze_ibfk_1` FOREIGN KEY (`IdBroni`) REFERENCES `bron` (`IdBroni`);

--
-- Constraints for table `recenzja`
--
ALTER TABLE `recenzja`
  ADD CONSTRAINT `recenzja_ibfk_1` FOREIGN KEY (`IdBroni`) REFERENCES `bron` (`IdBroni`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
