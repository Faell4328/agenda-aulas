<?php

require __DIR__.'/../vendor/autoload.php';

use App\Router;

header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

$req_method = $_SERVER["REQUEST_METHOD"];
$req_route_path = parse_url($_SERVER["REQUEST_URI"])["path"];

$route = new Router($req_route_path, $req_method);

?>