<?php

namespace App\Service;

use App\Tools\MongoDB;
use App\Tools\Cookie;

class SignIn{
    public function logInUser(){
        $mongodb = new MongoDB();
        $user_information = $mongodb -> loginUser($_POST["email"], $_POST["password"]);
        $cookie = new Cookie();
        $cookie -> createLoginToken($user_information["_id"]);
        
        echo "Logado";
        exit;
    }
}

?>