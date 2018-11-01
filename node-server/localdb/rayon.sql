CREATE DATABASE IF NOT EXISTS `rayon`;

USE `rayon`;

CREATE TABLE  IF NOT EXISTS `event_log` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `block_number` int(11) NOT NULL,
  `tx_hash` varchar(66) NOT NULL,
  `contract_address` varchar(42) NOT NULL,
  `event_name` varchar(100) NOT NULL,
  `function_name` varchar(100) NOT NULL,
  `input_data` varchar(300) DEFAULT NULL,
  `called_time` int(11) NOT NULL,
  `url_etherscan` varchar(300) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `environment` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `EVENT_HISTORY` (`contract_address`,`event_name`)
) ENGINE=InnoDB AUTO_INCREMENT=499;

CREATE TABLE IF NOT EXISTS `function_log` (
  `block_number` int(11) NOT NULL,
  `tx_hash` varchar(66) NOT NULL,
  `contract_address` varchar(42) NOT NULL,
  `function_name` varchar(100) NOT NULL,
  `input_data` varchar(300) DEFAULT NULL,
  `called_time` int(11) NOT NULL,
  `url_etherscan` varchar(300) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `environment` varchar(45) NOT NULL,
  PRIMARY KEY (`tx_hash`),
  KEY `METHOD_HISTORY` (`contract_address`,`function_name`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `holder_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(100) NOT NULL,
  `to` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL,
  `called_time` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=167;

GRANT ALL PRIVILEGES ON rayon.* TO 'rayonlocal'@'%' identified by 'rayonlocal';
FLUSH PRIVILEGES;
