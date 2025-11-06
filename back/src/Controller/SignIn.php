<?php

namespace App\Controller;

use App\Tools\Validation;

class SignIn{
    public function logInUser(){
        $validation = new Validation;
        $validation -> formInput("email");
        $validation -> formInput("password");

        $login_service = new \App\Service\SignIn;
        $login_service -> logInUser();
    }

    public function logOutUser(){
    }
}

?>