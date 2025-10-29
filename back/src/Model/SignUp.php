<?php

namespace App\Model;

use App\Tools\MongoDB;

class SignUp{
    public function registerUser(){
        $mongodb = new MongoDB();
        $mongodb -> registerUser($_POST["nome"], $_POST["email"], $_POST["senha"]);
    }
}

?>