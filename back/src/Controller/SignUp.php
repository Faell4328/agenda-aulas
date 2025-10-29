<?php

namespace App\Controller;

use App\Tools\Validation;

class SignUp{
    public function registerUser(){
        $validation = new Validation;
        $validation -> inputForm("nome");
        $validation -> inputForm("email");
        $validation -> inputForm("senha");

        $register_user_service = new \App\Model\SignUp;
        $register_user_service -> registerUser();
    }
}

?>