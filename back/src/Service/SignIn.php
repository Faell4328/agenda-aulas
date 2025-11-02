<?php

namespace App\Service;

use App\Tools\MongoDB;

class SignIn{
    public function logInUser(){
        $mongodb = new MongoDB();
        $mongodb -> loginUser($_POST["email"], $_POST["password"]);
    }
}

?>