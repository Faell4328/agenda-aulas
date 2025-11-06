<?php

namespace App\Controller;

use App\Tools\Validation;

class SignIn{
    public function loginUser(){
        $validation = new Validation;
        $validation -> formInput("email");
        $validation -> formInput("password");

        $service = new \App\Service\SignIn;
        $return_service = $service -> logInUser();

        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"]);
    }

    public function logoutUser(){
    }
}

?>