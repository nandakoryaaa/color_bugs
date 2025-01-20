<?php

class Ball
{
	public $pos;
	public $color;
	
	public function __construct(int $pos, int $color)
	{
		$this->pos = $pos;
		$this->color = $color;
	}
}
