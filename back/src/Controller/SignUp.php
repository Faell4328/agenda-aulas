<?php

namespace App\Controller;

use App\Tools\Validation;

class SignUp{
    public function registerUser(){
        $validation = new Validation;
        $validation -> inputForm("name");
        $validation -> inputForm("role");
        $validation -> inputForm("email");
        $validation -> inputForm("password");

        if(!($_POST["role"] == "teacher") && !($_POST["role"] == "student")){
            echo "Sua função está incorreta";
            exit;
        }

        $register_user_service = new \App\Model\SignUp;
        $register_user_service -> registerUser();
    }
}

?>