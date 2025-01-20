<?php

class MoveResponse
{
	public $addedBalls;
	public $nextColors;
	public $score;
	public $canContinue;
	public $tiles;

	public function __construct(
		array $addedBalls, array $nextColors, int $score, int $canContinue, array $tiles
	) {
		$this->addedBalls = $addedBalls;
		$this->nextColors = $nextColors;
		$this->score = $score;
		$this->canContinue = $canContinue;
		$this->tiles = $tiles;
	}
}
