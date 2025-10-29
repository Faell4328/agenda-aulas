<?php

namespace App\Model;

use App\Tools\MongoDB;

class Login{
    public function __construct(){
        $mongodb = new MongoDB();
        $mongodb -> loginUser($_POST["email"], $_POST["senha"]);
    }
}

?>