<?php

namespace App\Controller;

use App\Tools\Validation;

class SignIn{
    public function loginUser($req_body_json){
        $validation = new Validation;
        $validation -> fieldExists($req_body_json, "email");
        $validation -> fieldExists($req_body_json, "password");

        $service = new \App\Service\SignIn;
        $return_service = $service -> logInUser($req_body_json->email, $req_body_json->password);

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"]);
    }

    public function logoutUser(){
    }
}

?>