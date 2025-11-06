<?php

require __DIR__.'/../vendor/autoload.php';

use App\Router;

$req_method = $_SERVER["REQUEST_METHOD"];
$req_route_path = parse_url($_SERVER["REQUEST_URI"])["path"];

$route = new Router($req_route_path, $req_method);

?>