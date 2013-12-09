<?php
header('Content-type: text/plain');

$plowjson = file_get_contents('http://jeremybowers.com/plow/');
 
# Push JSON Output
header('Content-type: application/json');
echo $plowjson;
 
?>