<?php
require '../app/CB.php';
require '../app/DBHelper.php';
require '../app/XoShiRo.php';
require '../app/LineScanner.php';
require '../models/EmptyTilesCache.php';
require '../models/Request.php';
require '../models/Session.php';
require '../models/Move.php';

function addBalls(int $cnt, EmptyTilesCache $etc, array & $tiles, array & $moves, int $movePos): void
{
	$nextColors = new SplFixedArray($cnt);
	for ($i = 0; $i < $cnt; $i++) {
		$nextColors[$i] = 1 + XoShiRo::rnd(CB::COLORS);
	}
	
	$etc->setEmpty($tiles);

	for ($i = 0; $i < $cnt; $i++) {
		if (!$etc->hasMore()) {
			break;
		}
		$pos = $etc->getRandomPosition();
		$color = $nextColors[$i];
		$tiles[$pos] = $color;
		$moves[$movePos + $i] = ($pos << 8) + $color;
	}
}

function removeBalls(LineScanner $ls, array & $tiles): int
{
	if ($ls->scanLines($tiles, CB::LINE_LENGTH)) {
		$marks = $ls->getMarks();
		$cnt = 0;
		for ($pos = 0; $pos < CB::FIELD_SIZE; $pos++) {
			if ($marks[$pos] !== 0) {
				$tiles[$pos] = 0;
				$cnt++;
			}
		}
		return $cnt;
	}

	return 0;
}

function processPlayRequest(PDO $pdo, int $uid): ?array
{
	$session = Session::get($pdo, $uid);

	if (!$session) {
		return null;
	}

	$moves = Move::findAll($pdo, $session->uid >> 32);
	if (!$moves) {
		return null;
	}

	XoShiRo::seed(
		$session->rand_seed[0],
		$session->rand_seed[1],
		$session->rand_seed[2],
		$session->rand_seed[3]
	);

	$etc = new EmptyTilesCache(CB::FIELD_SIZE);
	$ls = new LineScanner(CB::W, CB::H);
	$tiles = array_fill(0, CB::FIELD_SIZE, 0);

	$cnt = count($moves);
	$movesOut = array_fill(0, $cnt + $cnt * CB::ADDED_BALLS + CB::INITIAL_BALLS, 0);
	
	addBalls(CB::INITIAL_BALLS, $etc, $tiles, $movesOut, 0);
	$pos = CB::INITIAL_BALLS;
	for ($i = 0; $i < $cnt; $i++) {
		$move = (int) $moves[$i]['move'];
		$srcPos = $move & 255;
		$dstPos = ($move >> 8) & 255;
		if ($srcPos < CB::FIELD_SIZE && $dstPos < CB::FIELD_SIZE) {
			$movesOut[$pos++] = $move;
			$tiles[$dstPos] = $tiles[$srcPos];
			$tiles[$srcPos] = 0;
			if (removeBalls($ls, $tiles)) {
				$pos++;
			} else {
				addBalls(CB::ADDED_BALLS, $etc, $tiles, $movesOut, $pos);
				$pos += 3;
				removeBalls($ls, $tiles);
			}
		} else {
			break;
		}
	}

	return [
		'w' => CB::W,
		'h' => CB::H,
		'initialBalls' => CB::INITIAL_BALLS,
		'addedBalls' => CB::ADDED_BALLS,
		'lineLength' => CB::LINE_LENGTH,
		'moves' => $movesOut
	];
}

$t = microtime(true);

header_remove('x-powered-by');

$uid = Request::getInt('uid');

if (!$uid) {
	die('error');
}

$pdo = new PDO(CB::DSN);

if (!$pdo) {
	die('error');
}

$response = null;


$response = processPlayRequest($pdo, $uid);

if (!$response) {
	die('error');
}

echo json_encode($response);
