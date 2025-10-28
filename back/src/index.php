<?php

header('Content-type: application/json; charset=utf-8');

require_once("router.php");

$method = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER["REQUEST_URI"];

if(in_array($uri, $routes)){
}

$data = [
    "status" => "ok",
    "mensagem" => "Teste"
];

echo(json_encode($data));

?>