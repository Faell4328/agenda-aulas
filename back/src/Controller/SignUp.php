<?php

namespace App\Controller;

use App\Tools\Validation;

class SignUp{
    public function registerUser($req_body_json){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "name");
        $validation -> fieldExists($req_body_json, "role");
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        if(!($req_body_json->role == "teacher") && !($req_body_json->role == "student")){
            new \App\Controller\SendingPattern("error", "So é permitido as funções \"professor\" ou \"estudante\"");
        }

        $service = new \App\Service\SignUp;
        $return_service = $service -> registerUser($req_body_json->name, $req_body_json->role, $req_body_json->email, $req_body_json->password);
            
        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}

?>