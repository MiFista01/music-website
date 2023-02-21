-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Фев 21 2023 г., 03:20
-- Версия сервера: 10.4.25-MariaDB
-- Версия PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `music`
--

-- --------------------------------------------------------

--
-- Структура таблицы `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `performerId` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `count_clicks` int(11) DEFAULT NULL,
  `img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `albums`
--

INSERT INTO `albums` (`id`, `title`, `performerId`, `year`, `count_clicks`, `img`) VALUES
(1, 'Panic', 1, 2017, NULL, 'imgs/albums/ashes/panic.jpeg'),
(2, 'Elements', 2, 2012, NULL, 'imgs/albums/cult/elements.jpg'),
(3, 'Speed', 3, 2020, NULL, 'imgs/albums/raizer/speed.jpg'),
(4, 'Starlight', 4, 2019, NULL, 'imgs/albums/starset/starlight.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `favourites`
--

CREATE TABLE `favourites` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `trackid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `favourites`
--

INSERT INTO `favourites` (`id`, `userid`, `trackid`) VALUES
(1, 2, 1),
(2, 2, 4),
(3, 2, 2),
(4, 2, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `genres`
--

INSERT INTO `genres` (`id`, `title`) VALUES
(1, 'ROCKSSS'),
(2, 'ELECTRONIC');

-- --------------------------------------------------------

--
-- Структура таблицы `performers`
--

CREATE TABLE `performers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `des` text DEFAULT NULL,
  `directory` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `performers`
--

INSERT INTO `performers` (`id`, `name`, `year`, `des`, `directory`) VALUES
(1, 'Ashes', 2012, 'Ash are a Northern Irish rock band formed in Downpatrick in 1992 by vocalist and guitarist Tim Wheeler, bassist Mark Hamilton and drummer Rick McMurray. As a three-piece, they released mini-album Trailer in 1994 and full-length album 1977 in 1996. This 1996 release was named by NME as one of the 500 greatest albums of all time.[8] After the success of their full debut the band recruited Charlotte Hatherley as a guitarist and vocalist, releasing their second record Nu-Clear Sounds in 1998. After narrowly avoiding bankruptcy, the band released Free All Angels in 2001 and a string of successful singles.', 'ashes'),
(2, 'Cult', 2012, 'Cult to Follow is the new project of former The Union Underground singer Bryan Scott. The band has toured with Three Days Grace, Flyleaf, Theory Of A Deadman, The Exies, Sick Puppies, just to name of a few. They have a album slated for release in March of 2012!!', 'cult'),
(3, 'Raizer', 2005, ' onipq w4rpo qf ap oiewq poi  eq[poi erw[po frqgapoij fe ihufaeihu fwqg pjo ega o; ijoga ', 'raizer'),
(4, 'Starset', 2011, '[poad s[p da [op fdsa pok  lkjfds lij fds  lifsdfoij dfsaiou fd sahoi fd safdsa oiha uh fdsa    ojfis', 'starset');

-- --------------------------------------------------------

--
-- Структура таблицы `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `playlists`
--

INSERT INTO `playlists` (`id`, `title`, `img`) VALUES
(1, 'ROCK', 'imgs/playlists/rock.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `tracks`
--

CREATE TABLE `tracks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `albumId` int(11) NOT NULL,
  `count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `tracks`
--

INSERT INTO `tracks` (`id`, `title`, `link`, `albumId`, `count`) VALUES
(1, 'White', 'music/ashes/ashes.mp3', 1, NULL),
(2, 'Pan', 'music/cult/cult.mp3', 2, NULL),
(3, 'Speed', 'music/raizer/raizer_speed.mp3', 3, NULL),
(4, 'Starlight', 'music/starset/starset_starlight.mp3', 4, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `track_genres`
--

CREATE TABLE `track_genres` (
  `id` int(11) NOT NULL,
  `trackId` int(11) NOT NULL,
  `genreId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `track_genres`
--

INSERT INTO `track_genres` (`id`, `trackId`, `genreId`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `track_playlists`
--

CREATE TABLE `track_playlists` (
  `id` int(11) NOT NULL,
  `trackId` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `track_playlists`
--

INSERT INTO `track_playlists` (`id`, `trackId`, `playlistId`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nick` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `nick`, `password`, `salt`) VALUES
(1, 'admin', '$2b$10$XV21URkha1FSBkyTQ0gweusF6e4pbq/T3LmjzQtOu5vYrlFU.60jy', '$2b$10$XV21URkha1FSBkyTQ0gweu'),
(2, 'mifista', '$2b$10$ixOGLnWac38QJrJTmOYFe.KK8vIRhOMECHMI.VxbMRv7RJ6g9qxTy', '$2b$10$ixOGLnWac38QJrJTmOYFe.');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `performerId` (`performerId`);

--
-- Индексы таблицы `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `trackid` (`trackid`);

--
-- Индексы таблицы `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `performers`
--
ALTER TABLE `performers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `albumId` (`albumId`);

--
-- Индексы таблицы `track_genres`
--
ALTER TABLE `track_genres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trackId` (`trackId`),
  ADD KEY `genreId` (`genreId`);

--
-- Индексы таблицы `track_playlists`
--
ALTER TABLE `track_playlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trackId` (`trackId`),
  ADD KEY `playlistId` (`playlistId`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `favourites`
--
ALTER TABLE `favourites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `performers`
--
ALTER TABLE `performers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `tracks`
--
ALTER TABLE `tracks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `track_genres`
--
ALTER TABLE `track_genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `track_playlists`
--
ALTER TABLE `track_playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`performerId`) REFERENCES `performers` (`id`);

--
-- Ограничения внешнего ключа таблицы `favourites`
--
ALTER TABLE `favourites`
  ADD CONSTRAINT `favourites_ibfk_11` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favourites_ibfk_12` FOREIGN KEY (`trackid`) REFERENCES `tracks` (`id`);

--
-- Ограничения внешнего ключа таблицы `tracks`
--
ALTER TABLE `tracks`
  ADD CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`albumId`) REFERENCES `albums` (`id`);

--
-- Ограничения внешнего ключа таблицы `track_genres`
--
ALTER TABLE `track_genres`
  ADD CONSTRAINT `track_genres_ibfk_10` FOREIGN KEY (`genreId`) REFERENCES `genres` (`id`),
  ADD CONSTRAINT `track_genres_ibfk_9` FOREIGN KEY (`trackId`) REFERENCES `tracks` (`id`);

--
-- Ограничения внешнего ключа таблицы `track_playlists`
--
ALTER TABLE `track_playlists`
  ADD CONSTRAINT `track_playlists_ibfk_10` FOREIGN KEY (`playlistId`) REFERENCES `playlists` (`id`),
  ADD CONSTRAINT `track_playlists_ibfk_9` FOREIGN KEY (`trackId`) REFERENCES `tracks` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
