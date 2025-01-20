<?php
class DBHelper
{
	public static function findOne(PDOStatement $sth): ?array
	{
		if ($sth->execute()) {
			$row = $sth->fetch(PDO::FETCH_ASSOC);
			$sth->closeCursor();

			return $row ?: null;
		}
	
		return null;
	}

	public static function findAll(PDOStatement $sth): ?array
	{
		if ($sth->execute()) {
			$out = $sth->fetchAll(PDO::FETCH_ASSOC);
			$sth->closeCursor();

			return $out ?: null;
		}
		
		return null;
	}
}
