<?php

class XoShiRo
{
	private static $s0, $s1, $s2, $s3;
	
    private static function rotl(int $x, int $k): int
    {
        return (($x << $k) & 0xffffffff) | ($x >> (32 - $k));
    }

	public static function seed(int $s0, int $s1, int $s2, int $s3): void
	{
		self::$s0 = $s0;
		self::$s1 = $s1;
		self::$s2 = $s2;
		self::$s3 = $s3;
	}

	public static function state(): array
	{
		return [self::$s0, self::$s1, self::$s2, self::$s3];
	}
	
    public static function next(): int
    {
        $result = (self::rotl(self::$s1 * 5, 7) * 9) & 0xffffffff;
        $t = (self::$s1 << 9) & 0xffffffff;
        self::$s2 ^= self::$s0;
        self::$s3 ^= self::$s1;
        self::$s1 ^= self::$s2;
        self::$s0 ^= self::$s3;
        self::$s2 ^= $t;
        self::$s3 = self::rotl(self::$s3, 11);

        return $result;
    }

    public static function rnd(int $range): int
    {
        return (int) self::next() * $range / 0xffffffff;
    }
}
