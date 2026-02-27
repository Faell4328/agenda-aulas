<?php

declare(strict_types=1);

namespace App\Controller;

use App\Tools\Validation;
use App\Tools\SendingPattern;
use App\Service\Auth as AuthService;

class Auth{
    public function loginUser(?object $req_body_json): void{
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        $service = new AuthService;
        $return_service = $service -> loginUser((string) $req_body_json->email, (string) $req_body_json->password);

        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"]);
    }

    public function registerUser(?object $req_body_json): void{
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "role");
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        if(!($req_body_json->role == "teacher" || $req_body_json->role == "student")){
            new SendingPattern(400, "So é permitido as funções \"professor\" ou \"estudante\"");
            return;
        }

        $service = new AuthService;
        $return_service = $service -> registerUser((string) $req_body_json->name, (string) $req_body_json->role, (string) $req_body_json->email, (string) $req_body_json->password);
            
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function logOut(): void{
        if (!isset($_COOKIE["token"]) || $_COOKIE["token"] === "") {
            new SendingPattern(401, "Você não está autenticado", "/login");
        }

        $service = new AuthService;
        $return_service = $service -> logOut((string) $_COOKIE["token"]);
            
        new SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}

?>