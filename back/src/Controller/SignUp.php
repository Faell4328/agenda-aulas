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
            new \App\Controller\SendingPattern("error", "So é permitido as funções \"professor\" ou \"estudante\"");
        }

        $service = new \App\Service\SignUp;
        $return_service = $service -> registerUser();
            
        new \App\Controller\SendingPattern($return_service["status"], $return_service["message"], $return_service["redirect"], $return_service["data"]);
    }
}

?>