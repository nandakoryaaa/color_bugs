<?php
class LineScanner {
	private $w, $h, $fieldSize;
	private $marks;
	
	public function __construct($w, $h)
	{
		$this->w = $w;
		$this->h = $h;
		$this->fieldSize = $w * $h;
	}
	
	public function clearMarks(): void
	{
		$this->marks = array_fill(0, $this->fieldSize, 0);
	}
	
	public function getMarks(): array
	{
		return $this->marks;
	}

	private static function countElements(
		array $tiles, int $pos, int $step, int $maxLength
	): int
	{
		$color = $tiles[$pos];
		$cnt = 1;
		while (--$maxLength > 0) {
			$pos += $step;
			if ($tiles[$pos] !== $color) {
				break;
			}
			$cnt++;
		}
		return $cnt;
	}

	private function scanDirection(
		array $tiles, int $pos, int $step, int $maxLength, int $requiredCnt
	): int
	{
		if ($maxLength > $this->w) {
			$maxLength = $this->w;
		} else if ($maxLength > $this->h) {
			$maxLength = $this->h;
		}
		$result = 0;
		while ($maxLength >= $requiredCnt) {
			$cnt = self::countElements($tiles, $pos, $step, $maxLength);
			if ($tiles[$pos] !== 0 && $cnt >= $requiredCnt) {
				$result = 1;
				for ($i = 0; $i < $cnt; $i++) {
					$this->marks[$pos + $step * $i] = 1;
				}
			}
			$maxLength -= $cnt;
			$pos += $cnt * $step;
		}
		return $result;
	}

	private function scanLinesRight(array $tiles, int $requiredCnt): int
	{
		$result = 0;
		for ($y = 0; $y < $this->h; $y++) {
			$result += $this->scanDirection($tiles, $y * $this->w, 1, $this->w, $requiredCnt);
		}
		return $result;
	}

	private function scanLinesDown(array $tiles, int $requiredCnt): int
	{
		$result = 0;
		for ($x = 0; $x < $this->w; $x++) {
			$result += $this->scanDirection($tiles, $x, $this->w, $this->h, $requiredCnt);
		}
		return $result;
	}

	private function scanLinesRightUp(array $tiles, int $requiredCnt): int
	{
		$result = 0;
		$step = -$this->w + 1;
		for ($y = $requiredCnt - 1; $y < $this->h; $y++) {
			$result += $this->scanDirection(
				$tiles, $y * $this->w, $step, $y + 1, $requiredCnt
			);
		}
		for ($x = 1; $x <= $this->w - $requiredCnt; $x++) {
			$result += $this->scanDirection(
				$tiles, ($this->h - 1) * $this->w + $x, $step, $this->w - $x, $requiredCnt
			);
		}
		return $result;
	}

	private function scanLinesRightDown(array $tiles, int $requiredCnt): int
	{
		$result = 0;
		$step = $this->w + 1;
		for ($y = 0; $y <= $this->h - $requiredCnt; $y++) {
			$result += $this->scanDirection(
				$tiles, $y * $this->w, $step, $this->h - $y, $requiredCnt
			);
		}
		for ($x = 1; $x < $this->w - $requiredCnt + 1; $x++) {
			$result += $this->scanDirection($tiles, $x, $step, $this->w - $x, $requiredCnt);
		}
		return $result;
	}

	public function scanLines(array $tiles, int $requiredCnt): int
	{
		$this->marks = array_fill(0, $this->fieldSize, 0);

		return $this->scanLinesRight($tiles, $requiredCnt)
			+ $this->scanLinesDown($tiles, $requiredCnt)
			+ $this->scanLinesRightUp($tiles, $requiredCnt)
			+ $this->scanLinesRightDown($tiles, $requiredCnt);
	}
}
