<?php

class InitResponse
{
	public $uid;
	public $w;
	public $h;
	public $colors;
	public $nextColors;
	public $tiles;
	
	public function __construct(
		int $uid, int $w, int $h, int $colors, array $nextColors, array $tiles
	) {
		$this->uid = $uid;
		$this->w = $w;
		$this->h = $h;
		$this->colors = $colors;
		$this->nextColors = $nextColors;
		$this->tiles = $tiles;
	}
}
