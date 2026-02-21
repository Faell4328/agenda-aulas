<?php

require __DIR__.'/../vendor/autoload.php';

use App\Tools\SendingPattern;
use App\Router;

header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$req_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$req_route_path = '/';
$parsed = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if ($parsed !== null && $parsed !== false) {
    $req_route_path = $parsed;
}

$req_body_json = null;
$raw_input = file_get_contents('php://input');
if ($raw_input === false) {
    new SendingPattern(500, 'Erro ao ler os dados enviados');
}

if ($raw_input !== null && $raw_input !== '') {
    $req_body_json = json_decode($raw_input);
    if (json_last_error() !== JSON_ERROR_NONE) {
        new SendingPattern(400, 'Erro ao decodificar os dados enviados');
    }
}

$route = new Router($req_route_path, $req_method, $req_body_json);
?>