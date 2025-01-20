<?php

class TempSession
{
	public $id;
	public $rand_id;
	public $rand_seed;
	public $date_created = 0;

	public static function create(PDO $pdo): ?TempSession
	{
		$session = new self();
		$rs = $pdo->query('select uuid()', PDO::FETCH_NUM);
		$uuid = str_replace('-', '', $rs->fetchColumn(0));
		$rs->closeCursor();

		$hrtime = hrtime();

		Xoshiro::seed(
			$hrtime[0],
			intval(substr($uuid, 0, 8), 16),
			intval(substr($uuid, 8, 8), 16),
			$hrtime[1]
		);

		$session->rand_id = XoShiRo::next();
		$session->rand_seed = XoShiRo::state();
		$session->date_created = time();

		$result = self::save($pdo, $session);
		if ($result) {
			$session->id = $pdo->lastInsertId();
			return $session;
		}
		
		return null;
	}

	public static function save(PDO $pdo, TempSession $session): bool
	{
		$ps = $pdo->prepare(
			'insert into tmp_session(rand_id, rand_seed, date_created)
			 values(:rand_id, :rand_seed, :date_created)'
		);
		$ps->bindValue(':rand_id', $session->rand_id);
		$ps->bindValue(':rand_seed', Session::encodeBinary($session->rand_seed));
		$ps->bindValue(':date_created', $session->date_created);
		
		return $ps->execute() !== false;
	}

	public static function delete(PDO $pdo, TempSession $session): bool
	{
		$result = $pdo->exec('delete from tmp_session where id=' . $session->id);
		
		return $result !== false;
	}
	
	public static function get(PDO $pdo, int $id, int $rand_id): ?TempSession
	{
		$ps = $pdo->prepare('select * from tmp_session where id=:id and rand_id=:rand_id');
		$ps->bindValue(':id', $id);
		$ps->bindValue(':rand_id', $rand_id);
		$data = DBHelper::findOne($ps);
		if ($data) {
			$session = new self();
			$session->id = (int) $data['id'];
			$session->rand_id = (int) $data['rand_id'];
			$session->rand_seed = Session::decodeBinary($data['rand_seed']);
			$session->date_created = (int) $data['date_created'];
			return $session;
		}
		return null;
	}
}
