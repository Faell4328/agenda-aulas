<?php

namespace App\Service;

use App\Tools\MongoDB;
use App\Tools\Cookie;

class SignIn{
    public function logInUser(){
        $mongodb = new MongoDB();
        $returnDb = $mongodb -> loginUser($_POST["email"], $_POST["password"]);
        if($returnDb === true){
            $cookie = new Cookie();
            $cookie -> createLoginToken($_POST["email"]);
            
            echo "Logado";
            exit;
        }
        else{
            echo $returnDb;
            exit;
        }
    }
}

?>