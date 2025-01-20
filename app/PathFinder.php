<?php
class PathFinder
{
	public static function findPath(
		array $tiles, int $w, int $h, int $srcPos, int $dstPos
	): bool
	{
		$fieldSize = $w * $h;
		$field = array_fill(0, $fieldSize, 255);

		$field[$dstPos] = 0;
		$changed = true;
		while ($changed) {
			$changed = false;
			for ($y = 0; $y < $h; $y++) {
				for ($x = 0; $x < $w; $x++) {
					$pos = $y * $w + $x;
					if ($field[$pos] === 255) {
						continue;
					}

					$limit = $field[$pos] + 1;

					if ($x > 0) {
						$p = $pos - 1;
						if ($p == $srcPos) {
							return true;
						} else if ($tiles[$p] === 0) {
							if ($field[$p] > $limit) {
								$field[$p] = $limit;
								$changed = true;
							}
						}
					}
					if ($x < $w - 1) {
						$p = $pos + 1;
						if ($p == $srcPos) {
							return true;
						} else if ($tiles[$p] === 0) {
							if ($field[$p] > $limit) {
								$field[$p] = $limit;
								$changed = true;
							}
						}
					}
					if ($y > 0) {
						$p = $pos - $w;
						if ($p == $srcPos) {
							return true;
						} else if ($tiles[$p] === 0) {
							if ($field[$p] > $limit) {
								$field[$p] = $limit;
								$changed = true;
							}
						}
					}
					if ($y < $h - 1) {
						$p = $pos + $w;
						if ($p == $srcPos) {
							return true;
						} else if ($tiles[$p] === 0) {
							if ($field[$p] > $limit) {
								$field[$p] = $limit;
								$changed = true;
							}
						}
					}
				}
			}
		}

		return false;
	}
}
