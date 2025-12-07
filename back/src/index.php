<?php

require __DIR__.'/../vendor/autoload.php';

use App\Controller\SendingPattern;
use App\Router;

header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$req_method = $_SERVER["REQUEST_METHOD"];
$req_route_path = parse_url($_SERVER["REQUEST_URI"])["path"];
$req_body_json;

try{
    $req_body_json = json_decode(file_get_contents("php://input"));
}
catch(\Exception $ex){
    new \App\Controller\SendingPattern(500, "Erro ao processar os dados enviado");
}

$route = new Router($req_route_path, $req_method, $req_body_json);

?>