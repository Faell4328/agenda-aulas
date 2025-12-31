<?php

namespace App\Tools;

class SendingPattern{
    public function __construct($status, $message = null, $redirect = null, $data = null){

        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode(["message" => $message, "redirect" => $redirect, "data" => $data]);
        exit;
    }
}

?>