<?php

class Move
{
	public $session_id;
	public $turn;
	public $move;

	public static function save(
		PDO $pdo, int $session_id, int $turn, int $move
	): bool
	{
		$ps = $pdo->prepare('insert into move values(:sid, :turn, :move)');
		
		$ps->bindValue(':sid', $session_id);
		$ps->bindValue(':turn', $turn);
		$ps->bindValue(':move', $move);

		return $ps->execute() !== false;
	}

	public static function findAll(PDO $pdo, int $session_id): ?array
	{
		$ps = $pdo->prepare('select move from move where session_id=:sid order by turn');
		$ps->bindValue(':sid', $session_id);
		return DBHelper::findAll($ps);
	}
}
