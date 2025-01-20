<?php

class Session
{
	public $uid;
	public $rand_seed;
	public $rand_state;
	public $date_created = 0;
	public $score = 0;
	public $turn = 0;
	public $tiles = null;
	public $isNew = true;

	private static function encodeTiles(array $tiles): string
	{
		$values = array_fill(0, 11, 0);
		$pos = 0;
		for($i = 0; $i < 80; $i += 8) {
			$values[$pos++] = 
				$tiles[$i]
				| ($tiles[$i + 1] << 4)
				| ($tiles[$i + 2] << 8)
				| ($tiles[$i + 3] << 12)
				| ($tiles[$i + 4] << 16)
				| ($tiles[$i + 5] << 20)
				| ($tiles[$i + 6] << 24)
				| ($tiles[$i + 7] << 28);
		}
		$values[$pos] = $tiles[80];

		return pack('L11', ...$values);
	}

	private static function decodeTiles(string $data): array
	{
		$values = unpack('L11', $data);
		$pos = 1;
		$tiles = array_fill(0, CB::FIELD_SIZE, 0);
		for($i = 0; $i < 80; $i += 8) {
			$val = $values[$pos++];
			$tiles[$i] = $val & 15;
			$tiles[$i + 1] = ($val >> 4) & 15;
			$tiles[$i + 2] = ($val >> 8) & 15;
			$tiles[$i + 3] = ($val >> 12) & 15;
			$tiles[$i + 4] = ($val >> 16) & 15;
			$tiles[$i + 5] = ($val >> 20) & 15;
			$tiles[$i + 6] = ($val >> 24) & 15;
			$tiles[$i + 7] = ($val >> 28) & 15;
		}
		$tiles[80] = $values[$pos] & 15;

		return $tiles;
	}

	public static function encodeBinary(array $state): string
	{
		return pack('L4', ...$state);
	}

	public static function decodeBinary(string $bin): array
	{
		$values = unpack('L4', $bin);
		return [
			(int) $values[1],
			(int) $values[2],
			(int) $values[3],
			(int) $values[4]
		];
	}

	public static function save(PDO $pdo, Session $session): bool
	{
		$ps = $pdo->prepare(
			'insert into session values(:uid, :rand_seed, :rand_state, :date_created, 0, :turn, :tiles)'
		);
		
		$ps->bindValue(':uid', $session->uid);
		$ps->bindValue(':rand_seed', self::encodeBinary($session->rand_seed));
		$ps->bindValue(':rand_state', self::encodeBinary($session->rand_state));
		$ps->bindValue(':date_created', $session->date_created);
		$ps->bindValue(':turn', $session->turn);
		$ps->bindValue(':tiles', self::encodeTiles($session->tiles));

		return $ps->execute() !== false;
	}

	public static function update(PDO $pdo, Session $session): bool
	{
		$ps = $pdo->prepare(
			'update session set rand_state=:rand_state, score=:score, turn=:turn, tiles=:tiles where uid=:uid'
		);
		
		$ps->bindValue(':rand_state', self::encodeBinary($session->rand_state));
		$ps->bindValue(':score', $session->score);
		$ps->bindValue(':turn', $session->turn);
		$ps->bindValue(':tiles', self::encodeTiles($session->tiles));
		$ps->bindValue(':uid', $session->uid);
		return $ps->execute() !== false;
	}

	public static function get(PDO $pdo, int $uid): ?Session
	{
		$ps = $pdo->prepare('select * from session where uid=:uid');
		$ps->bindValue(':uid', $uid);
		$data = DBHelper::findOne($ps);

		if ($data) {
			$session = new self();
			$session->uid = (int) $data['uid'];
			$session->rand_seed = self::decodeBinary($data['rand_seed']);
			$session->rand_state = self::decodeBinary($data['rand_state']);
			$session->date_created = (int) $data['date_created'];
			$session->score = (int) $data['score'];
			$session->turn = (int) $data['turn'];
			$session->tiles = self::decodeTiles($data['tiles']);
			$session->isNew = false;

			return $session;
		}
		
		return null;
	}

}
