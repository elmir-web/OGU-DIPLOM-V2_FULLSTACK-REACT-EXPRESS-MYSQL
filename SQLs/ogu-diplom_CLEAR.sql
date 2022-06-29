-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Июн 29 2022 г., 09:29
-- Версия сервера: 5.5.25
-- Версия PHP: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `ogu-diplom`
--

-- --------------------------------------------------------

--
-- Структура таблицы `base`
--

CREATE TABLE IF NOT EXISTS `base` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

--
-- Дамп данных таблицы `base`
--

INSERT INTO `base` (`ID`, `Name`) VALUES
(0, 'Временное содержание кандидатов');

-- --------------------------------------------------------

--
-- Структура таблицы `car`
--

CREATE TABLE IF NOT EXISTS `car` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Model` varchar(50) COLLATE utf8_bin NOT NULL,
  `Number` varchar(10) COLLATE utf8_bin NOT NULL,
  `IDgsm` int(10) unsigned NOT NULL,
  `IDgarage` int(10) unsigned NOT NULL,
  `mileage` int(10) NOT NULL DEFAULT '0',
  `liters` decimal(10,3) NOT NULL DEFAULT '0.000',
  `expense` decimal(10,3) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDgarage` (`IDgarage`),
  KEY `IDgsm` (`IDgsm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `checkconnect`
--

CREATE TABLE IF NOT EXISTS `checkconnect` (
  `statusConnect` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `checkconnect`
--

INSERT INTO `checkconnect` (`statusConnect`) VALUES
(1);

-- --------------------------------------------------------

--
-- Структура таблицы `garage`
--

CREATE TABLE IF NOT EXISTS `garage` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL,
  `IDbase` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDbase` (`IDbase`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `gsm`
--

CREATE TABLE IF NOT EXISTS `gsm` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL,
  `ForKilo` decimal(10,3) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `gsm`
--

INSERT INTO `gsm` (`ID`, `Name`, `ForKilo`) VALUES
(1, 'Бензин', '0.980'),
(2, 'Дизтопливо', '0.850');

-- --------------------------------------------------------

--
-- Структура таблицы `positions`
--

CREATE TABLE IF NOT EXISTS `positions` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Role` varchar(30) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `positions`
--

INSERT INTO `positions` (`ID`, `Role`) VALUES
(0, 'Кандидат'),
(1, 'Водитель'),
(2, 'Подписант'),
(3, 'Админ');

-- --------------------------------------------------------

--
-- Структура таблицы `record`
--

CREATE TABLE IF NOT EXISTS `record` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `IDgsm` int(10) unsigned NOT NULL,
  `IDcar` int(10) unsigned NOT NULL,
  `IDsheet` int(10) unsigned NOT NULL,
  `IDdriver` int(10) unsigned NOT NULL,
  `NumberPL` varchar(10) COLLATE utf8_bin NOT NULL,
  `Liter` decimal(10,3) NOT NULL,
  `usedLiter` decimal(10,3) NOT NULL,
  `openMileage` int(10) NOT NULL DEFAULT '0',
  `closeMileage` int(10) DEFAULT NULL,
  `recStatus` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  KEY `IDsheet` (`IDsheet`),
  KEY `IDcar` (`IDcar`),
  KEY `IDgsm` (`IDgsm`),
  KEY `IDdriver` (`IDdriver`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `sheet`
--

CREATE TABLE IF NOT EXISTS `sheet` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `NumberSheet` varchar(10) COLLATE utf8_bin NOT NULL,
  `DateSheet` date NOT NULL,
  `IDgarage` int(10) unsigned NOT NULL,
  `IDsigner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDgarage` (`IDgarage`),
  KEY `IDsigner` (`IDsigner`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `storehouse`
--

CREATE TABLE IF NOT EXISTS `storehouse` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `IDgsm` int(10) unsigned NOT NULL,
  `liters` decimal(10,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `worker`
--

CREATE TABLE IF NOT EXISTS `worker` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FIO` varchar(101) COLLATE utf8_bin NOT NULL,
  `loginUser` varchar(20) COLLATE utf8_bin NOT NULL,
  `passwordUser` varchar(30) COLLATE utf8_bin NOT NULL,
  `Function` int(10) unsigned NOT NULL DEFAULT '1',
  `IDbase` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDbase` (`IDbase`),
  KEY `Function` (`Function`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Дамп данных таблицы `worker`
--

INSERT INTO `worker` (`ID`, `FIO`, `loginUser`, `passwordUser`, `Function`, `IDbase`) VALUES
(1, 'Кубагушев Эльмир Ирекович', 'ELMIR.WEB', 'ELMIR.PASSWORD', 3, 0);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `car`
--
ALTER TABLE `car`
  ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`IDgarage`) REFERENCES `garage` (`ID`),
  ADD CONSTRAINT `car_ibfk_2` FOREIGN KEY (`IDgsm`) REFERENCES `gsm` (`ID`);

--
-- Ограничения внешнего ключа таблицы `garage`
--
ALTER TABLE `garage`
  ADD CONSTRAINT `garage_ibfk_1` FOREIGN KEY (`IDbase`) REFERENCES `base` (`ID`);

--
-- Ограничения внешнего ключа таблицы `record`
--
ALTER TABLE `record`
  ADD CONSTRAINT `record_ibfk_1` FOREIGN KEY (`IDsheet`) REFERENCES `sheet` (`ID`),
  ADD CONSTRAINT `record_ibfk_2` FOREIGN KEY (`IDcar`) REFERENCES `car` (`ID`),
  ADD CONSTRAINT `record_ibfk_3` FOREIGN KEY (`IDgsm`) REFERENCES `gsm` (`ID`),
  ADD CONSTRAINT `record_ibfk_4` FOREIGN KEY (`IDdriver`) REFERENCES `worker` (`ID`);

--
-- Ограничения внешнего ключа таблицы `sheet`
--
ALTER TABLE `sheet`
  ADD CONSTRAINT `sheet_ibfk_1` FOREIGN KEY (`IDgarage`) REFERENCES `garage` (`ID`),
  ADD CONSTRAINT `sheet_ibfk_2` FOREIGN KEY (`IDsigner`) REFERENCES `worker` (`ID`);

--
-- Ограничения внешнего ключа таблицы `storehouse`
--
ALTER TABLE `storehouse`
  ADD CONSTRAINT `storehouse_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `gsm` (`ID`);

--
-- Ограничения внешнего ключа таблицы `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`IDbase`) REFERENCES `base` (`ID`),
  ADD CONSTRAINT `worker_ibfk_2` FOREIGN KEY (`Function`) REFERENCES `positions` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
