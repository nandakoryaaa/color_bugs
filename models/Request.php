<?php
class Request
{
	public static function getInt(string $name): ?int
	{
		return isset($_GET[$name]) ? (int) $_GET[$name] : null;
	}

	public static function getString(string $name): ?string
	{
		return isset($_GET[$name]) ? $_GET[$name] : null;
	}

}
