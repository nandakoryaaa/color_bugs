<?php

class EmptyTilesCache
{
	private $cnt = 0;
	private $fieldSize = 0;
	private $positions;
	
	public function __construct(int $fieldSize)
	{
		$this->fieldSize = $fieldSize;
		$this->positions = new SplFixedArray($fieldSize);
	}

	public function setEmpty(array $tiles): int
	{
		$this->cnt = 0;
		for ($i = 0; $i < $this->fieldSize; $i++) {
			if ($tiles[$i] === 0) {
				$this->positions[$this->cnt++] = $i;
			}
		}
		return $this->cnt;
	}

	public function hasMore(): bool
	{
		return $this->cnt > 0;
	}
	
	public function getRandomPosition(): int
	{
		if ($this->cnt === 0) {
			throw new Exception('No more positions');
		}
		$randIndex = XoShiRo::rnd($this->cnt);
		$pos = $this->positions[$randIndex];
		$this->cnt--;
		$this->positions[$randIndex] = $this->positions[$this->cnt];

		return $pos;
	}
}
