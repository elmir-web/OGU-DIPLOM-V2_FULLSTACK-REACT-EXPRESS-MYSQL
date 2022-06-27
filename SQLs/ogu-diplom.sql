-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июн 27 2022 г., 13:03
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
(0, 'Временное содержание кандидатов'),
(1, 'База №1'),
(2, 'База №2');

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

--
-- Дамп данных таблицы `car`
--

INSERT INTO `car` (`ID`, `Model`, `Number`, `IDgsm`, `IDgarage`, `mileage`, `liters`, `expense`) VALUES
(1, 'ВАЗ', 'А111АА', 1, 1, 0, '40.000', '7.900'),
(2, 'ГАЗ', 'ББ222Б', 1, 2, 0, '80.000', '15.300'),
(3, 'КАМАЗ', 'ВВ333В', 2, 3, 0, '400.000', '25.000'),
(4, 'Зил 2', 'ГГ441Г', 1, 2, 0, '80.000', '18.300');

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

--
-- Дамп данных таблицы `garage`
--

INSERT INTO `garage` (`ID`, `Name`, `IDbase`) VALUES
(1, 'Первый гараж', 1),
(2, 'Гараж №2', 1),
(3, 'Гараж №3', 2);

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
(2, 'Дизтопливо', '0.850'),
(3, 'Масло', '0.900');

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
  `IDsheet` int(10) UNSIGNED NOT NULL,
  `IDcar` int(10) UNSIGNED NOT NULL,
  `IDdriver` int(10) UNSIGNED NOT NULL,
  `NumberPL` varchar(10) COLLATE utf8_bin NOT NULL,
  `IDgsm` int(10) UNSIGNED NOT NULL,
  `Liter` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `record`
--

INSERT INTO `record` (`ID`, `IDsheet`, `IDcar`, `IDdriver`, `NumberPL`, `IDgsm`, `Liter`) VALUES
(1, 1, 1, 1, '1', 1, '1.000'),
(2, 1, 1, 1, '2', 3, '1.000'),
(3, 2, 2, 2, '3', 1, '10.000'),
(4, 2, 4, 2, '4', 3, '10.000'),
(5, 3, 3, 3, '5', 2, '100.000'),
(6, 3, 3, 3, '6', 2, '10.000');

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

--
-- Дамп данных таблицы `sheet`
--

INSERT INTO `sheet` (`ID`, `NumberSheet`, `DateSheet`, `IDgarage`, `IDsigner`) VALUES
(1, '111', '2021-09-01', 1, 4),
(2, '222', '2021-09-01', 2, 4),
(3, '5', '2022-03-26', 1, 33);

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
(1, 'Иванов А. Д.', 'ivanov_login', 'ivanov_pass', 1, 1),
(2, 'Петров В. М.', 'petrov_test', 'petrov__test', 1, 1),
(3, 'Сидоров В. М.', 'sidorov_test', 'sidorov__test', 1, 2),
(4, 'Кузнецов А. Б.', 'kuznecov_login', 'kuznecov_pass', 2, 1),
(5, 'Васильев С. К.', 'vasiliev_test', 'vasiliev__test', 2, 2),
(33, 'Кубагушев Эльмир Ирекович', 'ELMIR.WEB', 'ELMIR.PASSWORD', 3, 0);

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
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `car`
--
ALTER TABLE `car`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `garage`
--
ALTER TABLE `garage`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `gsm`
--
ALTER TABLE `gsm`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `positions`
--
ALTER TABLE `positions`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `record`
--
ALTER TABLE `record`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `sheet`
--
ALTER TABLE `sheet`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `worker`
--
ALTER TABLE `worker`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

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
-- Ограничения внешнего ключа таблицы `worker`
--
ALTER TABLE `worker`
  ADD CONSTRAINT `worker_ibfk_1` FOREIGN KEY (`IDbase`) REFERENCES `base` (`ID`),
  ADD CONSTRAINT `worker_ibfk_2` FOREIGN KEY (`Function`) REFERENCES `positions` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
