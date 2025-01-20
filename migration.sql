 CREATE TABLE `session` (
  `uid` bigint unsigned NOT NULL,
  `rand_seed` binary(16) NOT NULL,
  `rand_state` binary(16) NOT NULL,
  `date_created` int unsigned NOT NULL,
  `score` int unsigned NOT NULL,
  `turn` int unsigned NOT NULL,
  `tiles` binary(44) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB;

CREATE TABLE `tmp_session` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `rand_id` int unsigned NOT NULL,
  `rand_seed` binary(16) NOT NULL,
  `date_created` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `move` (
  `session_id` int unsigned NOT NULL,
  `turn` smallint unsigned NOT NULL,
  `move` smallint unsigned NOT NULL,
  PRIMARY KEY (`session_id`,`turn`)
) ENGINE=InnoDB;
