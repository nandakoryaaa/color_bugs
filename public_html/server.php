<?php

require '../app/CB.php';
require '../app/DBHelper.php';
require '../app/XoShiRo.php';
require '../app/LineScanner.php';
require '../app/PathFinder.php';
require '../models/Ball.php';
require '../models/EmptyTilesCache.php';
require '../models/Request.php';
require '../models/Session.php';
require '../models/TempSession.php';
require '../models/Move.php';
require '../models/InitResponse.php';
require '../models/MoveResponse.php';

function nextColors(int $cnt): array
{
	$colors = array_fill(0, $cnt, 0);
	for ($i = 0; $i < $cnt; $i++) {
		$colors[$i] = 1 + XoShiRo::rnd(CB::COLORS);
	}
	
	return $colors;
}	

function addBalls(int $cnt, array & $tiles): array
{
	$nextColors = nextColors($cnt);

	$addedBalls = array_fill(0, $cnt, null);
	$etc = new EmptyTilesCache(CB::FIELD_SIZE);
	$etc->setEmpty($tiles);
	for ($i = 0; $i < $cnt; $i++) {
		if (!$etc->hasMore()) {
			break;
		}
		$pos = $etc->getRandomPosition();
		$color = $nextColors[$i];
		$tiles[$pos] = $color;
		$addedBalls[$i] = new Ball($pos, $color);
	}
	
	return $addedBalls;
}

function removeBalls(array & $tiles): int
{
	$lineScanner = new LineScanner(CB::W, CB::H);
	if ($lineScanner->scanLines($tiles, CB::LINE_LENGTH)) {
		$marks = $lineScanner->getMarks();
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

function createNewSession(TempSession $ts): Session
{
	$session = new Session();
	$session->uid = ($ts->id << 32) | $ts->rand_id;
	$session->rand_seed = $ts->rand_seed;
	$session->date_created = $ts->date_created;
	$session->tiles = array_fill(0, CB::FIELD_SIZE, 0);

	XoShiRo::seed(
		$session->rand_seed[0],
		$session->rand_seed[1],
		$session->rand_seed[2],
		$session->rand_seed[3]
	);

	addBalls(CB::INITIAL_BALLS, $session->tiles);
	
	return $session;
}

function processEmptyRequest(PDO $pdo): ?InitResponse
{
	$tempSession = TempSession::create($pdo);
	if (!$tempSession) {
		return null;
	}
	$session = createNewSession($tempSession);

	return new InitResponse(
		$session->uid, CB::W, CB::H, CB::COLORS, nextColors(CB::ADDED_BALLS), $session->tiles
	);
}

function processSessionRequest(PDO $pdo, int $uid): ?MoveResponse
{
	$sid = $uid >> 32;
	$rand_id = $uid & 0xffffffff;
	$session = Session::get($pdo, $uid);
	if (!$session) {
		$tempSession = TempSession::get($pdo, $sid, $rand_id);
		if ($tempSession) {
			$session = createNewSession($tempSession);
		}
	} else {
		XoShiRo::seed(
			$session->rand_state[0],
			$session->rand_state[1],
			$session->rand_state[2],
			$session->rand_state[3]
		);
	}

	if (!$session) {
		return null;
	}
	
	$addedBalls = array_fill(0, CB::ADDED_BALLS, null);
	
	$canContinue = canContinue($session->tiles);
	
	if ($canContinue) {
		$move = Request::getInt('m');
		if ($move) {
			$srcPos = $move & 255;
			$dstPos = ($move >> 8) & 255;
			if (
				$srcPos < CB::FIELD_SIZE && $dstPos < CB::FIELD_SIZE
				&& $session->tiles[$srcPos] > 0
				&& $session->tiles[$dstPos] === 0
				&& PathFinder::findPath($session->tiles, CB::W, CB::H, $srcPos, $dstPos)
			) {
				$session->tiles[$dstPos] = $session->tiles[$srcPos];
				$session->tiles[$srcPos] = 0;
				$cntRemoved = removeBalls($session->tiles);

				if (!$cntRemoved) {
					$addedBalls = addBalls(CB::ADDED_BALLS, $session->tiles);
					$cntRemoved = removeBalls($session->tiles);
				}

				if ($cntRemoved) {
					$session->score += 2 * $cntRemoved * $cntRemoved - 20 * $cntRemoved + 60;
				} else {
					$canContinue = canContinue($session->tiles);
				}
				
				$session->rand_state = XoShiRo::state();
				Move::save($pdo, $sid, $session->turn, $move);
				$session->turn++;

				if ($session->isNew) {
					Session::save($pdo, $session);
				} else {
					Session::update($pdo, $session);
				}
			}
		}
	}
	
	$nextColors = array_fill(0, CB::ADDED_BALLS, 0);
	for ($i = 0; $i < CB::ADDED_BALLS; $i++) {
		$nextColors[$i] = 1 + XoShiRo::rnd(CB::COLORS);
	}
	return new MoveResponse(
		$addedBalls, $nextColors, $session->score, $canContinue, $session->tiles
	);
}

function canContinue(array $tiles): bool
{
	return in_array(0, $tiles);
}

header_remove('x-powered-by');
$pdo = new PDO(CB::DSN);

if (!$pdo) {
	die('error');
}

$response = null;

$uid = Request::getInt('uid');

if (!$uid) {
	$response = processEmptyRequest($pdo);
} else {
	$response = processSessionRequest($pdo, $uid);
}

if (!$response) {
	die('error');
}

echo json_encode($response);
