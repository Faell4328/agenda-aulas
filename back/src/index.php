<?php

require __DIR__.'/../vendor/autoload.php';

use App\Router;

$method_req = $_SERVER["REQUEST_METHOD"];
$rota_req = $_SERVER["REQUEST_URI"];

$route = new Router($rota_req, $method_req);

?>