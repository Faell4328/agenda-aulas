<?php

namespace App\Controller;

use App\Tools\Validation;

class SignUp{
    public function registerUser(){
        $validation = new Validation;
        $validation -> formInput("name");
        $validation -> formInput("role");
        $validation -> formInput("email");
        $validation -> formInput("password");

        if(!($_POST["role"] == "teacher") && !($_POST["role"] == "student")){
            echo "So é permitido as funções \"professor\" (teacher) e \"estudante\" (student)";
            exit;
        }

        $register_user_service = new \App\Service\SignUp;
        $register_user_service -> registerUser();
    }
}

?>