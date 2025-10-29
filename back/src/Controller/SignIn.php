<?php

namespace App\Controller;

use App\Tools\Validation;

class SignIn{
    public function logInUser(){
        $validation = new Validation;
        $validation -> inputForm("email");
        $validation -> inputForm("senha");

        $login_service = new \App\Model\SignIn;
        $login_service -> logInUser();
    }

    public function logOutUser(){
    }
}

?>