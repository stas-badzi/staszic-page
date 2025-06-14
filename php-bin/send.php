<?php
if (!isset($_GET['id'])) die("No id");
$path = "../internal/" . $_GET['id'] . "/stderr";
if (!file_exists($path)) die("No file");
if (!is_readable($path)) die("No read");
$fd = fopen($path, "r") or die("Can't open file");
$str = fread($fd, 1024) or die("Can't read file");
echo $path;
echo $str;
?>