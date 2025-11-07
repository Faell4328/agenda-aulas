<?php

namespace App\Controller;

class SendingPattern{
    public function __construct($status, $message = null, $redirect = null, $data = null){

        header('Access-Control-Allow-Origin: http://localhost:4200');
        header('Access-Control-Allow-Methods: GET, POST');
        header('Access-Control-Allow-Credentials: true');

        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode(["message" => $message, "redirect" => $redirect, "data" => $data]);
        exit;
    }
}

?>