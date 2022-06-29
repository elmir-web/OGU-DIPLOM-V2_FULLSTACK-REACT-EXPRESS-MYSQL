-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июн 29 2022 г., 13:41
-- Версия сервера: 5.7.38-0ubuntu0.18.04.1
-- Версия PHP: 7.2.24-0ubuntu0.18.04.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ogu-diplom`
--

-- --------------------------------------------------------

--
-- Структура таблицы `base`
--

CREATE TABLE `base` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `base`
--

INSERT INTO `base` (`ID`, `Name`) VALUES
(0, 'Временное содержание кандидатов');

-- --------------------------------------------------------

--
-- Структура таблицы `car`
--

CREATE TABLE `car` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Model` varchar(50) COLLATE utf8_bin NOT NULL,
  `Number` varchar(10) COLLATE utf8_bin NOT NULL,
  `IDgsm` int(10) UNSIGNED NOT NULL,
  `IDgarage` int(10) UNSIGNED NOT NULL,
  `mileage` int(10) NOT NULL DEFAULT '0',
  `liters` decimal(10,3) NOT NULL DEFAULT '0.000',
  `expense` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `checkconnect`
--

CREATE TABLE `checkconnect` (
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

CREATE TABLE `garage` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL,
  `IDbase` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `gsm`
--

CREATE TABLE `gsm` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Name` varchar(50) COLLATE utf8_bin NOT NULL,
  `ForKilo` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `positions` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Role` varchar(30) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

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

CREATE TABLE `record` (
  `ID` int(10) UNSIGNED NOT NULL,
  `IDgsm` int(10) UNSIGNED NOT NULL,
  `IDcar` int(10) UNSIGNED NOT NULL,
  `IDsheet` int(10) UNSIGNED NOT NULL,
  `IDdriver` int(10) UNSIGNED NOT NULL,
  `NumberPL` varchar(10) COLLATE utf8_bin NOT NULL,
  `Liter` decimal(10,3) NOT NULL,
  `usedLiter` decimal(10,3) NOT NULL,
  `openMileage` int(10) NOT NULL DEFAULT '0',
  `closeMileage` int(10) DEFAULT NULL,
  `recStatus` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `sheet`
--

CREATE TABLE `sheet` (
  `ID` int(10) UNSIGNED NOT NULL,
  `NumberSheet` varchar(10) COLLATE utf8_bin NOT NULL,
  `DateSheet` date NOT NULL,
  `IDgarage` int(10) UNSIGNED NOT NULL,
  `IDsigner` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `storehouse`
--

CREATE TABLE `storehouse` (
  `ID` int(10) UNSIGNED NOT NULL,
  `IDgsm` int(10) UNSIGNED NOT NULL,
  `liters` decimal(10,3) NOT NULL DEFAULT '0.000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `worker`
--

CREATE TABLE `worker` (
  `ID` int(10) UNSIGNED NOT NULL,
  `FIO` varchar(101) COLLATE utf8_bin NOT NULL,
  `loginUser` varchar(20) COLLATE utf8_bin NOT NULL,
  `passwordUser` varchar(30) COLLATE utf8_bin NOT NULL,
  `Function` int(10) UNSIGNED NOT NULL DEFAULT '1',
  `IDbase` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `worker`
--

INSERT INTO `worker` (`ID`, `FIO`, `loginUser`, `passwordUser`, `Function`, `IDbase`) VALUES
(1, 'Кубагушев Эльмир Ирекович', 'ELMIR.WEB', 'ELMIR.PASSWORD', 3, 0);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `base`
--
ALTER TABLE `base`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDgarage` (`IDgarage`),
  ADD KEY `IDgsm` (`IDgsm`);

--
-- Индексы таблицы `garage`
--
ALTER TABLE `garage`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDbase` (`IDbase`);

--
-- Индексы таблицы `gsm`
--
ALTER TABLE `gsm`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `record`
--
ALTER TABLE `record`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDsheet` (`IDsheet`),
  ADD KEY `IDcar` (`IDcar`),
  ADD KEY `IDgsm` (`IDgsm`),
  ADD KEY `IDdriver` (`IDdriver`);

--
-- Индексы таблицы `sheet`
--
ALTER TABLE `sheet`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDgarage` (`IDgarage`),
  ADD KEY `IDsigner` (`IDsigner`);

--
-- Индексы таблицы `storehouse`
--
ALTER TABLE `storehouse`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDgsm` (`IDgsm`);

--
-- Индексы таблицы `worker`
--
ALTER TABLE `worker`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDbase` (`IDbase`),
  ADD KEY `Function` (`Function`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `base`
--
ALTER TABLE `base`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `car`
--
ALTER TABLE `car`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `garage`
--
ALTER TABLE `garage`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `gsm`
--
ALTER TABLE `gsm`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `positions`
--
ALTER TABLE `positions`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `record`
--
ALTER TABLE `record`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `sheet`
--
ALTER TABLE `sheet`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `storehouse`
--
ALTER TABLE `storehouse`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `worker`
--
ALTER TABLE `worker`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  ADD CONSTRAINT `storehouse_ibfk_1` FOREIGN KEY (`IDgsm`) REFERENCES `gsm` (`ID`);

--
-- Ограничения внешнего ключа таблицы `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`IDbase`) REFERENCES `base` (`ID`),
  ADD CONSTRAINT `worker_ibfk_2` FOREIGN KEY (`Function`) REFERENCES `positions` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
