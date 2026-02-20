<?php

namespace App\Controller;

use App\Tools\Validation;

class Auth{
    public function loginUser($req_body_json){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        $service = new \App\Service\Auth;
        $return_service = $service -> logInUser($req_body_json->email, $req_body_json->password);

        new \App\Tools\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"]);
    }

    public function registerUser($req_body_json){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "role");
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        if(!($req_body_json->role == "teacher" || $req_body_json->role == "student")){
            new \App\Tools\SendingPattern(400, "So é permitido as funções \"professor\" ou \"estudante\"");
            return;
        }

        $service = new \App\Service\Auth;
        $return_service = $service -> registerUser($req_body_json->name, $req_body_json->role, $req_body_json->email, $req_body_json->password);
            
        new \App\Tools\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }

    public function logOut(){
        $service = new \App\Service\Auth;
        $return_service = $service -> logOut($_COOKIE["token"]);
            
        new \App\Tools\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}

?>