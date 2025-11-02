<?php

namespace App\Service;

use App\Tools\MongoDB;

class SignUp{
    public function registerUser(){
        $mongodb = new MongoDB();
        $mongodb -> registerUser($_POST["name"], $_POST["role"], $_POST["email"], $_POST["password"]);
    }
}

?>